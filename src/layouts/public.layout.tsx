import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type Props = PropsWithChildren<{
  hideNav?: boolean;
}>;

const PublicLayout = ({ hideNav, children }: Props) => {
  return (
    <div>
      <header className="p-3 bg-gray-500 border-b border-gray-600 mb-8 sticky top-0 z-10">
        <div className="container mx-auto flex gap-x-8 justify-between items-center">
          <div className="shrink-0">
            <h3 className="text-lg text-white">
              <a href="/">RPG公會創作模版工具</a>
            </h3>
          </div>
          <div className="flex-1">
            {!hideNav && (
              <nav className="space-x-6 text-sm text-white">
                <Link to="/">首頁</Link>
                <Link to="/marketplace">範例角色卡＆模版</Link>
                <a href="#">如何使用？</a>
              </nav>
            )}
          </div>
          <div className="shrink-0">
            <nav className="space-x-6 text-sm text-white">
              <a
                href="https://guild.gamer.com.tw/about.php?gsn=3014"
                target="_blank"
              >
                RPG公會
              </a>
              <a
                href="https://github.com/SilWolf/bahamut-guild-v2-toolkit"
                target="_blank"
              >
                對串插件
              </a>
              <a href="https://www.isaka.idv.tw/dice/" target="_blank">
                沙鷗擲骰網
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-210px)]">{children}</div>

      <footer className="text-center">
        <div className="container mx-auto pt-8 pb-8 space-y-6">
          <div className="h-px bg-gray-300"></div>
          <p className="text-sm text-gray-400">
            &copy; 2023 SilWolf's Workshop
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
