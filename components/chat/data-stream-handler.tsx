'use client';

import { useEffect, useRef } from 'react';
import { initialArtifactData, useArtifact, UIArtifact } from '@/hooks/chat/use-artifact'; // <-- import initialArtifactData and UIArtifact here
import { useDataStream } from './data-stream-provider';
// Ensure artifactDefinitions uses the same UIArtifact type from use-artifact
// import { artifactDefinitions } from '@/hooks/chat/use-artifact';
// TODO: Import artifactDefinitions from the correct module if needed, or define it here if required.
interface UIArtifactDefinition {
  kind: string;
  onStreamPart?: (params: {
    streamPart: any; // Accept any type to match actual delta type
    setArtifact: React.Dispatch<React.SetStateAction<UIArtifact>>;
    setMetadata: (metadata: Record<string, any>) => void;
  }) => void;
}

// Define artifactDefinitions as an empty array or import from the correct module if available
const artifactDefinitions: UIArtifactDefinition[] = [];
// Define or import the delta types used in the switch statement
type DataStreamDelta =
  | DataIdDelta
  | DataTitleDelta
  | DataKindDelta
  | DataClearDelta
  | DataFinishDelta;

type DataIdDelta = { type: 'data-id'; data: string };
type DataTitleDelta = { type: 'data-title'; data: string };
type DataKindDelta = { type: 'data-kind'; data: string };
type DataClearDelta = { type: 'data-clear' };
type DataFinishDelta = { type: 'data-finish' };

export function DataStreamHandler() {
  const { dataStream } = useDataStream();

  const { artifact, setArtifact, setMetadata } = useArtifact();
  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    newDeltas.forEach((delta) => {
      const artifactDefinition: UIArtifactDefinition | undefined = artifactDefinitions.find(
        (artifactDefinition: UIArtifactDefinition) => artifactDefinition.kind === artifact.kind,
      );

      if (artifactDefinition?.onStreamPart) {
        artifactDefinition.onStreamPart({
          streamPart: delta,
          setArtifact,
          setMetadata,
        });
      }

      setArtifact((draftArtifact) => {
        // draftArtifact is of type UIArtifact
        if (!draftArtifact) {
          return { ...initialArtifactData, status: 'streaming' } as typeof draftArtifact;
        }

        switch ((delta as DataStreamDelta).type) {
          case 'data-id':
            return {
              ...draftArtifact,
              documentId: (delta as DataIdDelta).data,
              status: 'streaming',
            };
          case 'data-title':
            return {
              ...draftArtifact,
              title: (delta as DataTitleDelta).data,
              status: 'streaming',
            };
          case 'data-kind':
            return {
              ...draftArtifact,
              kind: (delta as DataKindDelta).data,
              status: 'streaming',
            };
          case 'data-clear':
            return {
              ...draftArtifact,
              content: '',
              status: 'streaming',
            };
          case 'data-finish':
            return {
              ...draftArtifact,
              status: 'idle',
            };
          default:
            return draftArtifact;
        }
      });
    });
  }, [dataStream, setArtifact, setMetadata, artifact]);

  return null;
}
