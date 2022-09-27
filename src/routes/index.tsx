import { createBrowserRouter } from 'react-router-dom';
import Root from '@src/pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,

  }
])

export default router;
