import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sparkles, ArrowRight, Activity, Clock } from 'lucide-react';

export const HomePage: React.FC = () => {
  const contents = [
    {
      id: 'legendre',
      title: 'ルジャンドル変換の視覚的理解',
      path: '/legendre',
      isAvailable: true,
      statusBadge: '公開中',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      description:
        '清水テキスト特有の幾何学的定義（長方形面積 xp と下面積 f(x) の差分）および双対性 g\'(p) = x を、スライダー操作でリアルタイムに動的体験できます。',
      tags: ['ルジャンドル変換', 'ピースワイズ関数', '双対性', '幾何学定義'],
    },
    {
      id: 'carnot',
      title: 'カルノーサイクルの p-V / T-S 線図連動',
      path: '#',
      isAvailable: false,
      statusBadge: '順次追加予定',
      badgeColor: 'bg-slate-700/50 text-slate-400 border-slate-600/40',
      description:
        '可逆サイクルの状態変化、仕事、吸収・放熱量、エントロピー変化を対話的に操作し、状態空間上のループを可視化します。',
      tags: ['カルノーサイクル', 'p-V線図', 'T-S線図', '熱効率'],
    },
    {
      id: 'entropy-surface',
      title: 'エントロピー最大化と平衡状態の3D曲面',
      path: '#',
      isAvailable: false,
      statusBadge: '順次追加予定',
      badgeColor: 'bg-slate-700/50 text-slate-400 border-slate-600/40',
      description:
        '内部自由度の解放にともなうエントロピー単調増加と、極大値としての平衡状態への到達を 3D パースペクティブで描画します。',
      tags: ['エントロピー', '熱力学平衡', '3D曲面', '極大原理'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Header showBackButton={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8">
        {/* Welcome Hero Banner */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-800/90 to-sky-950/40 rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Thermodynamics Interactive Visualization Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-snug">
            教科書の図像を動かして深める、熱力学サポート教材
          </h2>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            清水明 著『熱力学の基礎（第2版）』に出てくる抽象的な数式やグラフを、ブラウザ上で動かしたり色分け表示することで視視覚的・直感的に理解を深める非公式学習ポータルです。
          </p>
        </div>

        {/* Contents Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400" />
              学習コンテンツ一覧
            </h3>
            <span className="text-xs text-slate-400 font-mono">1 個のコンテンツが公開中</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  item.isAvailable
                    ? 'bg-slate-800/80 border-slate-700/80 hover:border-sky-500/60 shadow-lg hover:shadow-sky-500/10'
                    : 'bg-slate-900/50 border-slate-800/60 opacity-65'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${item.badgeColor}`}
                    >
                      {item.statusBadge}
                    </span>
                    {!item.isAvailable && <Clock className="w-4 h-4 text-slate-500" />}
                  </div>

                  <h4 className="text-base font-bold text-slate-100 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-900/80 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-700/40 mt-4">
                  {item.isAvailable ? (
                    <Link
                      to={item.path}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all group"
                    >
                      ツールを体験する
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-semibold text-xs border border-slate-700/50 cursor-not-allowed"
                    >
                      準備中
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 text-slate-500 text-xs py-4 px-4 text-center space-y-1">
        <p>
          清水明『熱力学の基礎（第2版）』非公式学習サポート Web アプリケーション
        </p>
        <p className="text-slate-600">
          Pure Client-Side Static Web App (Vite + React + TS)
        </p>
      </footer>
    </div>
  );
};
