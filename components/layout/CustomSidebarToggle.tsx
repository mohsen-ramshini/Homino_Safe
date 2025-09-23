import { SidebarLeftIcon } from '../chat/icons';
import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';
import { useSidebarContext } from '@/context/SidebarContext';

export function CustomSidebarToggle() {
  const { toggleSidebar } = useSidebar();
  const { toggleMainSidebar , isMainSidebarOpen} = useSidebarContext();

  const handleClick = () => {
    if (isMainSidebarOpen) {
        toggleSidebar();     
        toggleMainSidebar(); 
    }else{
        toggleSidebar();
    }
  };

  return (
        <Button
          data-testid="sidebar-toggle-button"
          onClick={handleClick}
          variant="outline"
          className="md:px-2 md:h-fit"
        >
          <SidebarLeftIcon size={16} />
        </Button>
  );
}
