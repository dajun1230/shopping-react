import { createBrowserRouter } from 'react-router-dom';
import Root from '@src/pages';
import UserManage from '@src/pages/user';
import UserList from '@src/pages/user/list';
import FileManage from '@src/pages/file';
import FileList from '@src/pages/file/list';
import FileUpload from '@src/pages/file/upload';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'user',
        element: <UserManage />,
        children: [
          {
            path: 'list',
            element: <UserList />,
          },
        ],
      },
      {
        path: 'file',
        element: <FileManage />,
        children: [
          {
            path: 'list',
            element: <FileList />,
          },
          {
            path: 'upload',
            element: <FileUpload />,
          },
        ],
      },
    ],
  },
]);

export default router;
