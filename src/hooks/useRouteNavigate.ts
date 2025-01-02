import { useNavigate, NavigateOptions, useLocation } from 'react-router-dom';
import { useAppContext } from './useAppContext';

export function useRouteNavigate() {
  const { appId } = useAppContext();
  const rootPath = `/zapps/${appId}`;
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  /**
   * Before navigation, create a new valid Zalo path
   * @param path is a relative path. Ex: "home", "about", "/account", "/list"
   * @param data is your data object. Can be get and use in the target path. Ex { images, records }
   */
  const goTo = (path: string, replace?: boolean, data?: any) => {
    let options = {
      preventScrollReset: true,
      viewTransition: true,
      replace: replace,
      state: data,
    } as NavigateOptions;
    if (!path) {
      console.warn('No path provided');
      return;
    }
    navigate(createPath(path), options);
  };

  /**
   * Jump to the specified path. More like replace the current path with the desired path.
   * @param path 
   * @param data is your data object. Can be get and use in the target path. Ex { images, records }
   */
  const jumpTo = (path: string, data?: any) => {
    let options = {
      preventScrollReset: true,
      viewTransition: true,
      state: data,
    } as NavigateOptions;
    if (!path) {
      console.warn('No path provided');
      return;
    }
    path = path.startsWith("/") ? path : `/${path}`;
    console.log(path);
    navigate(path, options);
  }

  const goHome = () => goTo(`${rootPath}`, true);

  const goBack = () => navigate(-1);

  const createPath = (path: string): string => {
    if (path.replace("/", "") === rootPath.replace("/", "")) return rootPath;
    return (path.startsWith("/")) ? `${rootPath}${path}` : `${rootPath}/${path}`
  }

  const belongings = location.state;

  return { 
    goTo, jumpTo, goHome, goBack, createPath, 
    rootPath, currentPath, belongings
  };
}
