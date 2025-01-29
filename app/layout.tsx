import './globals.css';
import Navbar from './components/Navbar'; // Импортируем Navbar

export const metadata = {
  title: 'Мой Сервис Заметок',
  description: 'Простой сервис для создания заметок',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {/* Навигационная панель */}
        <Navbar />

        {/* Основное содержимое страницы */}
        {children}
      </body>
    </html>
  );
}