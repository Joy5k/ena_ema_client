import { Toaster } from 'sonner';
import Providers from '../lib/Providers/Providers';



export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <Providers>
         <html lang='en'>
            <body>
                  <>
                     <Toaster position='top-center' />
                     {children}
                  </>
            </body>
         </html>
      </Providers>
   );
}
