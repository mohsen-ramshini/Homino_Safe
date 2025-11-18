import React from "react";

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-auto">
      <div className="flex w-full h-full items-center justify-center">
        <div className="w-full mx-auto h-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
