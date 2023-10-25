import useGoogleAuth from "@/hooks/useGoogleAuth.hook";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type Props = PropsWithChildren;

const PublicLayout = ({ children }: Props) => {
  const { isLogined } = useGoogleAuth();

  return (
    <div>
      <header className="p-3 bg-gray-500 border-b border-gray-600 mb-8 sticky top-0 z-10">
        <div className="container mx-auto flex gap-x-8 justify-between items-center">
          <div className="shrink-0">
            <h3 className="text-lg text-white">
              <a href="/">RPG公會創作模板工具</a>
            </h3>
          </div>
          <div className="flex-1">
            {isLogined && (
              <nav className="space-x-6 text-sm text-white">
                <Link to="/">首頁</Link>
                <Link to="/marketplace">範例角色卡＆模板</Link>
                <a
                  href="https://hackmd.io/@PWg311VDTh2gesW0WcvqFw/rJAa6I8Mp"
                  target="_blank"
                >
                  如何使用？
                </a>
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

      <footer>
        <div className="container mx-auto pt-8 pb-8 space-y-6">
          <div className="h-px bg-gray-300"></div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-400">
              &copy; 2023 SilWolf's Workshop
            </p>
            <nav className="text-sm text-gray-400 space-x-6">
              <Link to="/developer">偵錯頁面</Link>
              <Link to="/privacy-policy">隱私權政策</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
