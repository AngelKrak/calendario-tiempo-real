import 'react-toastify/dist/ReactToastify.min.css';
import '../styles/animations.css';
import '../styles/globals.css';
import { Nunito_Sans } from 'next/font/google';

export const nunito_sans = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito-sans',
});

export const metadata = {
  title: 'Calendario en tiempo real',
  description: 'Creado con Next JS y Socket IO.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${nunito_sans.className} ${nunito_sans.variable}`}>
        {children}
      </body>
    </html>
  );
}
