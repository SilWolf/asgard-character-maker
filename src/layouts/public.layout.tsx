import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type Props = PropsWithChildren;

const PublicLayout = ({ children }: Props) => {
  return (
    <div>
      <header className="p-3 bg-gray-500 border-b border-gray-600 mb-8">
        <div className="container mx-auto flex gap-x-4 justify-between items-center">
          <div>
            <h3 className="text-lg text-white">
              <Link to="/">RPG公會創作模版工具</Link>
            </h3>
          </div>
          <div>
            <nav className="space-x-6 text-sm text-white">
              <a href="#">如何使用？</a>
              <a href="#">RPG公會</a>
              <a href="#">對串插件</a>
              <a href="#">沙鷗擲骰網</a>
            </nav>
          </div>
        </div>
      </header>
      <div className="min-h-[calc(100vh-210px)]">{children}</div>
      <footer className="text-center">
        <div className="container mx-auto pt-8 pb-8 space-y-6">
          <div className="h-px bg-gray-400"></div>
          <p className="text-sm text-gray-400">
            &copy; 2023 SilWolf's Workshop
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
