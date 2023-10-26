import useGoogleAuth from "@/hooks/useGoogleAuth.hook";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type Props = PropsWithChildren;

const PublicLayout = ({ children }: Props) => {
  const { isLogined } = useGoogleAuth();

  return (
    <div>
      <header className="p-3 bg-neutral-500 dark:bg-neutral-800 border-b border-neutral-600 dark:border-neutral-900 mb-8 sticky top-0 z-10">
        <div className="container mx-auto flex gap-x-8 justify-between items-center">
          <div className="shrink-0">
            <h3 className="text-lg text-white">
              <a
                href="/"
                className="inline-block py-1 text-neutral-100 hover:text-white no-underline"
              >
                RPG公會創作模板工具
              </a>
            </h3>
          </div>
          <div className="flex-1">
            {isLogined && (
              <nav className="space-x-6 text-sm text-white">
                <Link
                  to="/"
                  className="inline-block py-1 text-neutral-100 hover:text-white no-underline"
                >
                  首頁
                </Link>
                <Link
                  to="/marketplace"
                  className="inline-block py-1 text-neutral-100 hover:text-white no-underline"
                >
                  範例角色卡＆模板
                </Link>
                <Link
                  to="/preference"
                  className="inline-block py-1 text-neutral-100 hover:text-white no-underline"
                >
                  偏好設定
                </Link>
                <a
                  href="https://hackmd.io/@PWg311VDTh2gesW0WcvqFw/rJAa6I8Mp"
                  target="_blank"
                  className="inline-block py-1 text-neutral-100 hover:text-white no-underline"
                >
                  如何使用？<i className="uil uil-external-link-alt"></i>
                </a>
              </nav>
            )}
          </div>
          <div className="shrink-0">
            <nav className="space-x-6 text-sm text-white">
              <a
                href="https://guild.gamer.com.tw/about.php?gsn=3014"
                target="_blank"
                className="inline-block py-1 text-neutral-100 hover:text-white no-underline"
              >
                RPG公會
              </a>
              <a
                href="https://github.com/SilWolf/bahamut-guild-v2-toolkit"
                target="_blank"
                className="inline-block py-1 text-neutral-100 hover:text-white no-underline"
              >
                對串插件
              </a>
              <a
                href="https://www.isaka.idv.tw/dice/"
                target="_blank"
                className="inline-block py-1 text-neutral-100 hover:text-white no-underline"
              >
                沙鷗擲骰網
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-210px)]">{children}</div>

      <footer>
        <div className="container mx-auto pt-8 pb-8 space-y-6">
          <div className="h-px bg-neutral-300 dark:bg-neutral-700"></div>
          <div className="flex justify-between">
            <p className="text-sm text-neutral-400">
              &copy; 2023 SilWolf's Workshop
            </p>
            <nav className="text-sm text-neutral-400 space-x-6">
              <a
                href="mailto:silwolf1121@gmail.com"
                className="text-neutral-400 hover:text-neutral-500 no-underline"
              >
                聯絡作者
              </a>
              <Link
                to="/privacy-policy"
                className="text-neutral-400 hover:text-neutral-500 no-underline"
              >
                隱私權政策
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
