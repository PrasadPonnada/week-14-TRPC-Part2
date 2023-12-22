import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '../utils/trpc'
import { useState } from 'react';
import ToDoApp from './components/ToDoApp';
// import './App.css'

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000',
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: "Bearer " + localStorage.getItem("token")
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ToDoApp />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

// export const TodoApp = () => {
//   return <h1>Todo APp</h1>
// }



