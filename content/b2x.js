(function () {
const R = String.raw;
const X = (window.EXTRA = window.EXTRA || []);
/* b2: レポート問題・研究レポートと解答 */

X.push({ unit: "b2", section: "b2s1", items: [
  { t: "ex", lab: "レポート", id: "b2-r7-1", num: "7 [1]", lv: 1,
    q: R`<p>（$\eps$-$\delta$ 論法の演習）以下の関数は $x=0$ において連続であることを証明せよ．</p>$$f(x)=\frac1{2^n}\ \ \left(x\in\left[\tfrac1{2^n},\tfrac1{2^{n-1}}\right),\ n=1,2,\dots\right),\qquad f(x)=0\ \ (x\le0).$$<p>（$x\ge1$ では適当に定義されているとする．）このように切れ切れに見える関数も定義に従うと連続になります．</p>`,
    a: R`<p>$f(0)=0$．$\forall\eps>0$ に対して $\delta=\min(\eps,1)$ とおく．$|x|\lt\delta$ のとき，$x\le0$ なら $f(x)=0$．$0\lt x\lt\delta$ なら $x\in\left[\frac1{2^n},\frac1{2^{n-1}}\right)$ となる $n$ があり $f(x)=\frac1{2^n}\le x\lt\eps$．いずれにせよ $|f(x)-f(0)|\lt\eps$．$\square$</p><p>もちろん $x=\frac12,\frac14,\dots$ では不連続です．全体的に眺めて不連続なことと，ある点において連続であることは別のことです．</p>` },
  { t: "ex", lab: "レポート", id: "b2-r7-2", num: "7 [2]", lv: 2,
    q: R`<p>以下の関数（トマエ関数）はすべての正の無理数において連続だが，正の有理数においては連続でないことを証明せよ（$x=0$ においては連続）．</p>$$f(x)=\frac1q\ \left(x=\tfrac pq>0\ \text{既約分数}\right),\qquad f(x)=0\ (x>0\ \text{無理数}),\qquad f(x)=0\ (x\le0).$$`,
    hint: R`無理数に近づく有理数，有理数に近づく無理数を考えよ．`,
    a: R`<p><b>正の有理数 $x_0=\frac pq$ で不連続</b>：$f(x_0)=\frac1q>0$．無理数は稠密なので $x_0$ に収束する無理数列 $x_n$ がとれ，$f(x_n)=0\not\to\frac1q$．</p><p><b>正の無理数 $x_0$ で連続</b>：$f(x_0)=0$．$\forall\eps>0$，$\frac1q\ge\eps$ すなわち $q\le\frac1\eps$ となる分母をもつ有理数で区間 $(x_0-1,x_0+1)$ に入るものは有限個（各 $q$ について高々 $2q+1$ 個）．それらのうち $x_0$ に最も近いものとの距離を $\delta$（$>0$，$x_0$ は有理数でないので）とすれば，$|x-x_0|\lt\delta$ なら $x$ が有理数 $\frac pq$ でも $q>\frac1\eps$ なので $f(x)\lt\eps$．無理数なら $f(x)=0$．よって連続．</p><p><b>$x=0$ で連続</b>：$0\lt x=\frac pq\lt\eps$ なら $p\ge1$ より $f(x)=\frac1q\le\frac pq\lt\eps$．$x\le0$ や無理数では 0．$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b2-r7-3", num: "7 [3][4]", lv: 1, pre: ["b2-dlimsupx"],
    q: R`<p>[3] $f(x)=2\ (x\in\Q)$，$1\ (x\notin\Q)$，$f(0)=0$ の $\limsup_{x\to0}f(x)$ と $\liminf_{x\to0}f(x)$ を求めよ（$x=0$ の値は関係しますか？）．</p><p>[4] $f(x)=x\sin\frac1x\ (x>0)$，$0\ (x=0)$，$3\sin\frac1x\ (x\lt0)$ の $x=0$ における 4 つの片側極限（$\limsup_{x\to\pm0}$，$\liminf_{x\to\pm0}$）を求めよ．</p>`,
    a: R`<p>[3] $0\lt|x|\lt\frac1n$ には有理数も無理数もあるので sup $=2$，inf $=1$．よって $\limsup_{x\to0}f=2$，$\liminf_{x\to0}f=1$．定義は $0\lt|x-x_0|$ なので $x=0$ の値 $f(0)=0$ は関係しない．</p><p>[4] $x>0$：$|x\sin\frac1x|\le x\to0$ なので $\limsup_{x\to+0}f=\liminf_{x\to+0}f=0$．$x\lt0$：$\sin\frac1x$ は 0 の近くで $-1$ から $1$ のすべての値を何度もとるので $\limsup_{x\to-0}f=3$，$\liminf_{x\to-0}f=-3$．</p>` },
  { t: "ex", lab: "研究レポート", id: "b2-rr7", num: "7", lv: 2,
    q: R`<p>微分積分学の有名な問題．以下の等式を証明せよ（右辺はディリクレ関数）．</p>$$\lim_{n\to\infty}\left(\lim_{m\to\infty}\{\cos(n!\pi x)\}^m\right)=\begin{cases}1&x\in\Q\\0&x\notin\Q\end{cases}$$<p>先に $m$ に関して lim をとって，その後で $n$ に関して lim をとるということ．</p>`,
    a: R`<p><b>$x$ が無理数のとき</b>：$n!x$ は整数でないので $|\cos(n!\pi x)|\lt1$．よってすべての $n$ で $\lim_m\{\cos(n!\pi x)\}^m=0$，外側の極限も $0$．</p><p><b>$x=\frac pq$（$q\ge1$）が有理数のとき</b>：$n\ge2q$ なら $q$ と $2q$ は $n$ 以下の異なる自然数なので $n!$ は $q\cdot2q$ で割り切れ，$n!x=\frac{n!}q\,p$ は $2q$ の倍数，とくに偶数．よって $\cos(n!\pi x)=1$ で $\lim_m1^m=1$．$n$ が大きいところで 1 なので外側の極限は $1$．$\square$</p><p><b>注意</b>：$n$ が小さいときは $\cos(n!\pi x)=-1$ となって内側の極限 $\lim_m(-1)^m$ が存在しないことがあるが，外側の極限には大きな $n$ だけが効くので問題ない（教科書によっては指数を $2m$ にしてこれを避けている）．各 $f_n(x)=\lim_m\{\cos(n!\pi x)\}^{2m}$ は有限個の点を除いて 0 の関数（リーマン積分可能）なのに，その極限のディリクレ関数はリーマン積分できない．ルベーグ積分なら単調収束定理などがそのまま使える．</p>` },
]});

X.push({ unit: "b2", section: "b2s2", items: [
  { t: "ex", lab: "レポート", id: "b2-r8-1", num: "8 [1]", lv: 2, pre: ["b2-ddini"],
    q: R`<p>次の関数の $x=0$ における 4 つのディニ導関数を求めよ（$\pm\infty$ のこともある）．</p><p>(1) $f(x)=2x\sin\frac1x\ (x>0)$，$0\ (x=0)$，$3x\sin\frac1x\ (x\lt0)$　(2) $f(x)=x^2\sin\frac1x\ (x\ne0)$，$0\ (x=0)$　(3) $f(x)=2|x|\ (x\in\Q)$，$3|x|\ (x\notin\Q)$　(4) $f(x)=\sin\frac1x\ (x\ne0)$，$0\ (x=0)$</p>`,
    hint: R`$f(0)=0$ なので平均変化率は $\frac{f(h)}h$．`,
    a: R`<p>どれも $f(0)=0$ なので平均変化率は $\frac{f(h)}h$．</p><p>(1) $h>0$：$\frac{f(h)}h=2\sin\frac1h$ は $[-2,2]$ を振動．$D^+f(0)=2$，$D_+f(0)=-2$．$h\lt0$：$3\sin\frac1h$ で $D^-f(0)=3$，$D_-f(0)=-3$．</p><p>(2) $\frac{f(h)}h=h\sin\frac1h\to0$．4 つとも $0$（$f'(0)=0$ で微分可能）．</p><p>(3) $h>0$：$\frac{f(h)}h=2\ (h\in\Q)$，$3\ (h\notin\Q)$．$D^+f(0)=3$，$D_+f(0)=2$．$h\lt0$：$\frac{f(h)}h=\frac{2|h|}h=-2\ (h\in\Q)$，$-3\ (h\notin\Q)$．$D^-f(0)=-2$，$D_-f(0)=-3$．</p><p>(4) $\frac{f(h)}h=\frac1h\sin\frac1h$．$h\to+0$ で $\sin\frac1h=\pm1$ となる点で $\pm\frac1h\to\pm\infty$．$D^+f(0)=+\infty$，$D_+f(0)=-\infty$．$h\to-0$ でも同様に $D^-f(0)=+\infty$，$D_-f(0)=-\infty$．（ディニ導関数は不連続関数に対しても定義できる．）</p>` },
  { t: "ex", lab: "レポート", id: "b2-r8-2", num: "8 [2]", lv: 1, pre: ["b2-p2-3"],
    q: R`<p>命題2-3 (2)「$D_+f(x)\lt t$ ならば単調減少数列 $x_n\to x$ で $f(x_n)-f(x)\lt t(x_n-x)$ となるものがとれる」を証明せよ．</p>`,
    a: R`<p>$b_n=\inf\left\{\frac{f(x+h)-f(x)}h:0\lt h\lt\frac1n\right\}$ は単調増加で $D_+f(x)$ に収束するので，すべての $n$ で $b_n\le D_+f(x)\lt t$．inf の性質より $0\lt h_n\lt\frac1n$，$\frac{f(x+h_n)-f(x)}{h_n}\lt t$ となる $h_n$ がとれる．$h_n>0$ を掛けて $f(x+h_n)-f(x)\lt t\,h_n=t((x+h_n)-x)$．$x+h_n\to x$（右から）なので，単調減少な部分列をとって $x_k=x+h_{n_k}$ とすればよい．$\square$（(3)(4) も左側で同様．）</p>` },
  { t: "ex", lab: "レポート", id: "b2-r8-3", num: "8 [3]", lv: 1, pre: ["b2-p2-4"],
    q: R`<p>補充プリントの命題2-4「$f$ が $a\lt c\lt b$ で最大値をとるならば $D^+f(c)\le0$，$D_-f(c)\ge0$」を証明せよ．</p>`,
    a: R`<p>最大値なので任意の $h$（$c+h\in[a,b]$）で $f(c+h)-f(c)\le0$．$h>0$ なら $\frac{f(c+h)-f(c)}h\le0$ なので，sup も $\le0$ で $D^+f(c)\le0$．$h\lt0$ なら分母が負なので $\frac{f(c+h)-f(c)}h\ge0$，inf も $\ge0$ で $D_-f(c)\ge0$．$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b2-rr8", num: "8", lv: 2, pre: ["b2-t2-1", "b2-t5-1"],
    q: R`<p>定理2-1 の下の $\int_{[a,b]}f'\,dm\ne f(b)-f(a)$ となる例は不連続な関数でした．連続関数でこのような例をみつけよ．</p>`,
    a: R`<p><b>悪魔の階段</b>（§5，[[b2-t5-1]]）．$[0,1]$ で連続・単調増加，$f'=0$ a.e. なので $\int_{[0,1]}f'\,dm=0$，一方 $f(1)-f(0)=1$．</p>` },
]});

X.push({ unit: "b2", section: "b2s3", items: [
  { t: "ex", lab: "レポート", id: "b2-r9-1", num: "9 [1]", lv: 1, pre: ["b2-dbv"],
    q: R`<p>次の関数は $[0,1]$ において有界変動関数ではないことを証明せよ．(1) $f(x)=1\ \left(\frac1{2k+1}\le x\le\frac1{2k},\ k=1,2,\dots\right)$，$0$（その他）　(2) $f(x)=x\ \left(\frac1{2k+1}\le x\le\frac1{2k}\right)$，$0$（その他）</p>`,
    hint: R`変動が発散するような開区間を上手く選ぶ．$\frac1{2k}$ と $\frac1{2k-1}$ の間では $f=0$．`,
    a: R`<p>$k\ge1$ について $u_k$ を $\frac1{2k}$ と $\frac1{2k-1}$ の中点とする．$\frac1{2k}\lt u_k\lt\frac1{2k-1}$ なので $f(u_k)=0$（$u_k$ はどの $\left[\frac1{2j+1},\frac1{2j}\right]$ にも入らない）．開区間 $\left(\frac1{2k},u_k\right)\ (k=1,\dots,n)$ は互いに素．</p><p>(1) $|f(\frac1{2k})-f(u_k)|=1$ なので変動 $=n\to\infty$．</p><p>(2) $|f(\frac1{2k})-f(u_k)|=\frac1{2k}$ なので変動 $=\sum_{k=1}^n\frac1{2k}\to\infty$．いずれも有界変動ではない．$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b2-r9-2", num: "9 [2]", lv: 1, pre: ["b2-dbv"],
    q: R`<p>$f$ が $[a,b]$ において有界変動関数であるとき，$[a,b]$ の中に互いに素な無限個の開区間 $(s_k,t_k)$ をとると $\sum_{k=1}^\infty|f(s_k)-f(t_k)|\le V(f;a,b)$ であることを証明せよ．</p>`,
    a: R`<p>各 $n$ について，最初の $n$ 個 $(s_1,t_1),\dots,(s_n,t_n)$ は互いに素な有限個の開区間なので，全変動の定義より $\sum_{k=1}^n|f(s_k)-f(t_k)|\le V(f;a,b)$．部分和は単調増加で上に有界なので収束し，$n\to\infty$ として $\sum_{k=1}^\infty|f(s_k)-f(t_k)|\le V(f;a,b)$．$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b2-rr9a", num: "9 [1]", lv: 3, pre: ["b2-dbv", "b2-p3-1"],
    q: R`<p>次の関数は $[0,1]$ において有界変動関数であることを証明せよ．</p>$$f(x)=x^2\ \left(\tfrac1{2k+1}\le x\le\tfrac1{2k},\ k=1,2,\dots\right),\qquad0\ (\text{その他}).$$<p>有界変動であることを証明するには「すべての開区間」を考える必要があります．どのように証明すればよいか？</p>`,
    hint: R`各小区間上では $f$ は単調増加．問題は区間の端での跳び．`,
    core: R`$f=\sum_kf_k$，$f_k=x^2\chi_{[\frac1{2k+1},\frac1{2k}]}$ と分ける．各 $f_k$ の全変動は（跳び 2 回と増加分）$\le\frac3{4k^2}$．変動は和について劣加法的なので $V(f)\le\sum V(f_k)\lt\infty$．`,
    a: R`<p>$I_k=\left[\frac1{2k+1},\frac1{2k}\right]$，$f_k=x^2\chi_{I_k}$ とおくと，$I_k$ は互いに素なので各点で和は高々 1 項で $f=\sum_kf_k$．</p><p><b>各 $f_k$ の全変動</b>：$f_k$ は $0$ から左端で $\frac1{(2k+1)^2}$ に跳び，$I_k$ 上で $\frac1{4k^2}$ まで増加し，右端の外で $0$ に戻る．したがって任意の互いに素な開区間に対して変動は（跳び上がり）＋（増加分）＋（跳び下がり）以下で</p>$$V(f_k;0,1)\le\frac1{(2k+1)^2}+\left(\frac1{4k^2}-\frac1{(2k+1)^2}\right)+\frac1{4k^2}=\frac1{2k^2}.$$<p><b>和の変動</b>：互いに素な開区間 $(s_j,t_j)$ に対して</p>$$\sum_j|f(s_j)-f(t_j)|=\sum_j\left|\sum_k(f_k(s_j)-f_k(t_j))\right|\le\sum_k\sum_j|f_k(s_j)-f_k(t_j)|\le\sum_kV(f_k;0,1)\le\sum_k\frac1{2k^2}=\frac{\pi^2}{12}.$$<p>よって $V(f;0,1)\le\frac{\pi^2}{12}\lt\infty$ で，$f$ は有界変動．$\square$</p><p>レポート 9 [1] との違いは跳びの大きさが $\frac1{4k^2}$ 程度で，その和が収束すること．</p>` },
  { t: "ex", lab: "研究レポート", id: "b2-rr9b", num: "9 [2]", lv: 3, pre: ["b2-dbv", "b2-p3-4"],
    q: R`<p>「微分可能な関数は有界変動か？」　資料の反例：$f(x)=x\sin\frac1x\ (x\ne0)$，$0\ (x=0)$ は $[0,1]$ において有界変動ではないことを証明せよ（レポート 9 [1] (2) の発展形）．</p>`,
    a: R`<p><b>有界変動でないこと</b>：$u_k=\frac1{(k+\frac12)\pi}$，$v_k=\frac1{k\pi}$ とおくと $u_k\lt v_k\lt u_{k-1}$ で $f(u_k)=\pm u_k$，$f(v_k)=0$．開区間 $(u_k,v_k)\ (k=1,\dots,n)$ は互いに素で</p>$$\sum_{k=1}^n|f(u_k)-f(v_k)|=\sum_{k=1}^n\frac1{(k+\frac12)\pi}\to\infty.$$<p>よって $[0,1]$ で有界変動ではない（連続ではある）．</p><p><b>注意（微分可能性）</b>：$x\sin\frac1x$ は $x=0$ で<b>微分可能ではない</b>（$\frac{f(h)}h=\sin\frac1h$ は収束しない．レポート 8 [1] (1) と同様に $D^+f(0)=1,\ D_+f(0)=-1$）．資料の「すべての点で微分可能」は誤りで，すべての点で微分可能な反例としては</p>$$g(x)=x^2\sin\frac1{x^2}\ (x\ne0),\qquad g(0)=0$$<p>をとればよい．$g'(0)=\lim h\sin\frac1{h^2}=0$，$x\ne0$ でも微分可能．一方 $u_k=\frac1{\sqrt{(k+\frac12)\pi}}$，$v_k=\frac1{\sqrt{k\pi}}$ とすると $|g(u_k)-g(v_k)|=u_k^2=\frac1{(k+\frac12)\pi}$ で，和は発散．よって $g$ は微分可能だが有界変動ではない（$g'$ が有界でないので命題3-4 の系は使えない）．</p>` },
  { t: "fix", html: R`<p>研究レポート 9 [2] の $x\sin\frac1x$ は $x=0$ で微分可能ではない．「すべての点で微分可能だが有界変動でない」例は $x^2\sin\frac1{x^2}$ である．</p>` },
]});

X.push({ unit: "b2", section: "b2s4", items: [
  { t: "ex", lab: "レポート", id: "b2-r10-1", num: "10 [1]", lv: 1,
    q: R`<p>$0\lt\alpha\lt1$ とする．$f$ が $[a,b]$ において <b>$\alpha$ 次のリプシッツ連続</b>（$\alpha$ 次のヘルダー連続）とは，ある $K>0$ が存在して $\forall x,y\in[a,b],\ |f(x)-f(y)|\le K|x-y|^\alpha$．$f(x)=\sqrt x$ は $[0,1]$ において $\frac12$ 次のリプシッツ連続関数であることを証明せよ．できる人は $\sqrt{|x|}$ が $[-1,1]$ において $\frac12$ 次のリプシッツ連続関数であることを証明せよ．</p>`,
    hint: R`$|\sqrt x-\sqrt y|\le\sqrt{|x-y|}$ を証明すればよい．`,
    a: R`<p>$x\ge y\ge0$ とする．$0\le\sqrt x-\sqrt y\le\sqrt x+\sqrt y$ なので</p>$$(\sqrt x-\sqrt y)^2\le(\sqrt x-\sqrt y)(\sqrt x+\sqrt y)=x-y.$$<p>よって $|\sqrt x-\sqrt y|\le\sqrt{|x-y|}$（$K=1$）．</p><p>$\sqrt{|x|}$ については，上の結果と $||x|-|y||\le|x-y|$ より $\left|\sqrt{|x|}-\sqrt{|y|}\right|\le\sqrt{||x|-|y||}\le\sqrt{|x-y|}$．$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b2-r10-2", num: "10 [2]", lv: 2, pre: ["b2-p4-4", "b2-p4-2"],
    q: R`<p>命題4-4「$f,g$ が $[a,b]$ において絶対連続ならば $fg$ も絶対連続」を証明せよ．ヒント：$f,g$ は有界です（なぜか？）．$f(s_k)g(s_k)-f(t_k)g(t_k)=f(s_k)(g(s_k)-g(t_k))+g(t_k)(f(s_k)-f(t_k))$．</p>`,
    a: R`<p>絶対連続なら一様連続（命題4-2），とくに閉区間上の連続関数なので有界：$|f|\le M$，$|g|\le M$（$M>0$）．$\forall\eps>0$ に対し，$f,g$ の絶対連続性から $\frac\eps{2M}$ に対応する $\delta_f,\delta_g$ をとり $\delta=\min(\delta_f,\delta_g)$ とする．$\sum(t_k-s_k)\lt\delta$ なら</p>$$\sum|f(s_k)g(s_k)-f(t_k)g(t_k)|\le\sum|f(s_k)||g(s_k)-g(t_k)|+\sum|g(t_k)||f(s_k)-f(t_k)|\lt M\frac\eps{2M}+M\frac\eps{2M}=\eps.$$<p>よって $fg$ は絶対連続．$\square$（有界性は定理4-1（有界変動）と命題3-2 からも分かる．）</p>` },
  { t: "ex", lab: "レポート", id: "b2-r10-3", num: "10 [3]", lv: 1,
    q: R`<p>（集合論の復習）以下の和集合を簡単な 1 つの集合で表せ．(1) $\bigcup_{0\lt r\lt1}A_r$，$A_r=\{x^2+y^2\lt r^2\}$（2 次元）　(2) $\bigcup_{0\lt x\lt1}[0,x]$　(3) $\bigcup_{0\le x\le1}(x,x+1)$　(4) $\bigcup_{0\lt x\lt1}\{x\}$</p>`,
    a: R`<p>(1) $\{(x,y):x^2+y^2\lt1\}$（開円板．$x^2+y^2\lt1$ なら $\sqrt{x^2+y^2}\lt r\lt1$ となる $r$ がある）．</p><p>(2) $[0,1)$（$y\lt1$ なら $y\lt x\lt1$ となる $x$ がある．$1$ はどの $[0,x]$ にも入らない）．</p><p>(3) $(0,2)$（$x=0$ で $(0,1)$，$x=1$ で $(1,2)$，間の $1$ は $x=\frac12$ の区間に入る）．</p><p>(4) $(0,1)$．非可算個の和集合でも，各集合の元を集めるだけである（ただし測度の可算加法性は使えない：1 点は測度 0 なのに和は測度 1）．</p>` },
  { t: "ex", lab: "研究レポート", id: "b2-rr10a", num: "10 [1]", lv: 2,
    q: R`<p>$f(x)=\sqrt[3]x$ は $[0,1]$ において $\frac13$ 次のリプシッツ連続関数であることを証明せよ．さらに出来たら $f(x)=x^\alpha\ (0\lt\alpha\lt1)$ は $[0,1]$ において $\alpha$ 次のリプシッツ連続関数であることを証明せよ．</p>`,
    core: R`$t\mapsto t^\alpha$ は劣加法的：$(a+b)^\alpha\le a^\alpha+b^\alpha$．$x=y+(x-y)$ に適用．`,
    a: R`<p>一般の $0\lt\alpha\lt1$ で示す．<b>補題</b>：$a,b\ge0$ なら $(a+b)^\alpha\le a^\alpha+b^\alpha$．（$a+b>0$ とし $u=\frac a{a+b},\ v=\frac b{a+b}\in[0,1]$ とおくと，$0\le u\le1$ で $u^\alpha\ge u$ なので $u^\alpha+v^\alpha\ge u+v=1$．両辺に $(a+b)^\alpha$ を掛ける．）</p><p>$0\le y\le x\le1$ とすると，補題を $a=y,\ b=x-y$ に使って $x^\alpha\le y^\alpha+(x-y)^\alpha$，すなわち $0\le x^\alpha-y^\alpha\le(x-y)^\alpha$．よって $|x^\alpha-y^\alpha|\le|x-y|^\alpha$（$K=1$）．$\alpha=\frac13$ が $\sqrt[3]x$．$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b2-rr10b", num: "10 [2]（定理4-2）", lv: 3, pre: ["b2-t3-2", "b2-t4-1", "b2-p3-3"],
    q: R`<p><b>定理4-2</b>　$f$ が $[a,b]$ において絶対連続ならば $f=g-h$（$g,h$ はともに絶対連続な単調増加関数）と表すことができる．これを証明せよ．</p>`,
    hint: R`定理3-2 の証明では $g(x)=V(f;a,x)$ が単調増加であることを示した．$g$ が絶対連続でもあることを証明すればよい．$\sum|g(s_k)-g(t_k)|=\sum V(f;s_k,t_k)$ に注意．`,
    a: R`<p>$f$ は絶対連続なので有界変動（定理4-1）．$g(x)=V(f;a,x)$，$h=g-f$ とおくと，定理3-2 の証明より $g,h$ は単調増加で $f=g-h$．$g$ が絶対連続なら $h=g-f$ も絶対連続（絶対連続関数の差）なので，$g$ の絶対連続性を示せばよい．</p><p>$\forall\eps>0$ に対し，$f$ の絶対連続性の $\delta$ をとる．互いに素な開区間 $(s_k,t_k)\ (k=1,\dots,n)$ で $\sum(t_k-s_k)\lt\delta$ とする．命題3-3 より $g(t_k)-g(s_k)=V(f;s_k,t_k)$．各 $k$ について $[s_k,t_k]$ 内の互いに素な開区間 $(s_{k,j},t_{k,j})$ を任意にとると，$k,j$ 全体を合わせても互いに素で長さの和 $\le\sum(t_k-s_k)\lt\delta$ だから</p>$$\sum_k\sum_j|f(s_{k,j})-f(t_{k,j})|\lt\eps.$$<p>各 $k$ ごとに内側の和の上限をとると $\sum_kV(f;s_k,t_k)\le\eps$．すなわち $\sum|g(t_k)-g(s_k)|\le\eps$ で，$g$ は絶対連続．$\square$</p>` },
]});

X.push({ unit: "b2", section: "b2s5", items: [
  { t: "ex", lab: "レポート", id: "b2-r11", num: "11", lv: 2, pre: ["b2-t5-1"],
    q: R`<p>悪魔の階段が $x=\frac13$ において左側微分できないことを証明せよ．ヒント：$x_0=\frac13$，$h_n=\frac2{3^n}$ として $x_0-h_n$ を 3 進小数で表すときにちょっと注意が必要．なぜ $\frac2{3^n}$ なのか？</p>`,
    a: R`<p>$x_0=\frac13=(0.0222\cdots)_{(3)}$，$f(x_0)=(0.0111\cdots)_{(2)}=\frac12$．$n\ge2$ について $h_n=\frac2{3^n}$ とすると，$x_0-h_n$ は $(0.0222\cdots)_{(3)}$ の第 $n$ 桁の 2 を 0 にしたもの：</p>$$x_0-h_n=(0.0\underbrace{2\cdots2}_{n-2}0222\cdots)_{(3)}\in C.$$<p>（$\frac1{3^n}$ だと第 $n$ 桁が 1 になり 0, 2 だけの表示にならない．だから $\frac2{3^n}$ にした．）よって</p>$$f(x_0-h_n)=(0.0\underbrace{1\cdots1}_{n-2}0111\cdots)_{(2)}=\frac12-\frac1{2^n}.$$<p>したがって</p>$$\frac{f(x_0)-f(x_0-h_n)}{h_n}=\frac{1/2^n}{2/3^n}=\frac12\left(\frac32\right)^n\to\infty.$$<p>左側の平均変化率が $+\infty$ に発散する（$D^-f(\frac13)=+\infty$）ので，左側微分係数（有限値）は存在しない．（右側では $f$ は $[\frac13,\frac23]$ で定数なので右微分係数は 0．）$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b2-rr11", num: "11", lv: 3, pre: ["b2-t5-1", "a2-t5-6"],
    q: R`<p>悪魔の階段 $f$ とカントール集合 $C$ に対して $g(x)=f(x)\ (x\notin C)$，$0\ (x\in C)$ とする．(1) $x\notin C$ において $g$ は連続である．(2) $x\in C$（ただし $x\ne0$）において $g$ は不連続である．以上より，非可算無限個の不連続点を持つが，不連続点の測度は $m(C)=0$ だから春学期 第 2 章 定理5-6 より $g$ は $[0,1]$ 上でリーマン積分可能である．これを証明せよ．</p>`,
    a: R`<p>(1) $x\notin C$ なら $x$ は取り除かれた開区間 $(a,b)$ に属し，その上で $g=f=$ 定数．開区間なので $x$ の近くで $g$ は定数，よって連続．</p><p>(2) $x\in C$，$x>0$ とする．$g(x)=0$．一方 $f(x)>0$（$x>0$ の 3 進展開には 2 が現れるので $f(x)$ の 2 進展開に 1 が現れる）．$C$ は内点をもたない（測度 0）ので，$x$ に収束する $C^c$ の点列 $x_n$ がとれ，$g(x_n)=f(x_n)\to f(x)>0$（$f$ は連続）．$g(x)=0$ なので $g$ は $x$ で不連続．</p><p>（$x=0$ では $0\le g\le f$，$f(x)\to0$ なので連続．）不連続点の集合は $C\setminus\{0\}$ で，非可算だが測度 0．$g$ は有界（$0\le g\le1$）なのでルベーグの判定法（[[a2-t5-6]]）よりリーマン積分可能で，$\int_0^1g\,dx=\int_{[0,1]}f\,dm=\frac12$（$C$ は測度 0．悪魔の階段は $f(1-x)=1-f(x)$ をみたすので積分は $\frac12$）．$\square$</p>` },
]});

X.push({ unit: "b2", section: "b2s6", items: [
  { t: "ex", lab: "レポート", id: "b2-r12-1", num: "12 [1]", lv: 1, pre: ["b2-dvitali"],
    q: R`<p>以下の集合族が $[0,1]$ をヴィタリ被覆しているかどうかについて，(1)(2) はヴィタリ被覆していない，(3)(4) はヴィタリ被覆していることを証明せよ（$n,m$ は自然数全体，$q$ は有理数全体を動く）．(1) $\left[0,\frac1n\right]$　(2) $\left[-\frac1n,\frac1n\right]$　(3) $\left[q-\frac1n,q+\frac1n\right]$　(4) $\left[\frac mn-\frac1n,\frac mn\right]$</p>`,
    a: R`<p>(1)(2) $x=\frac12$ を含む区間は $n\le2$ のもの（$[0,1],[0,\frac12]$ や $[-1,1],[-\frac12,\frac12]$）だけで，長さは $\ge\frac12$．$\eps=\frac12$ に対して長さ $\lt\eps$ の区間がとれないのでヴィタリ被覆ではない．</p><p>(3) $\forall x\in[0,1],\ \forall\eps>0$：$\frac2n\lt\eps$ となる $n$ をとり，有理数の稠密性から $|x-q|\lt\frac1n$ となる有理数 $q$ をとる．$x\in\left[q-\frac1n,q+\frac1n\right]$ で長さ $\frac2n\lt\eps$．</p><p>(4) $\forall x\in[0,1],\ \forall\eps>0$：$\frac1n\lt\eps$ となる $n$ をとり，$m=\lceil nx\rceil$（$x=0$ のときは $m=1$）とおく．$m-1\lt nx\le m$（$x=0$ なら $0=\frac{m-1}n$）なので $x\in\left[\frac{m-1}n,\frac mn\right]$，長さ $\frac1n\lt\eps$．$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b2-r12-2", num: "12 [2]", lv: 1, pre: ["b2-t6-4", "a1-t3-1"],
    q: R`<p>ヴィタリの被覆定理（有限個版）の系「$\eps>0$ に対して $N$ を十分大きくとると $m^*\left(A\cap\bigcup_{n=1}^NI_n\right)>m^*(A)-\eps$」を証明せよ．</p>`,
    a: R`<p>有限個版より $N$ を大きくとると $m^*\left(A\setminus\bigcup_{n\le N}I_n\right)\lt\eps$．$A=\left(A\cap\bigcup_{n\le N}I_n\right)\cup\left(A\setminus\bigcup_{n\le N}I_n\right)$ なので外測度の劣加法性より</p>$$m^*(A)\le m^*\left(A\cap\bigcup I_n\right)+m^*\left(A\setminus\bigcup I_n\right)\lt m^*\left(A\cap\bigcup I_n\right)+\eps.\quad\square$$<p>（$m^*(A)\lt\infty$ なので移項できる．）</p>` },
  { t: "ex", lab: "研究レポート", id: "b2-rr12", num: "12", lv: 1, pre: ["b2-dvitali", "a1-p2-2d"],
    q: R`<p>$[0,1]$ 内の有理数を $q_1,q_2,\dots$ と番号付けする．集合族 $\left\{\left[q_n-\frac1{4^n},q_n+\frac1{4^n}\right]\right\}_{n=1}^\infty$ は $[0,1]$ をヴィタリ被覆していないことを証明せよ．（ひっかけ問題です．実は普通の意味でも被覆していません．なぜか？）</p>`,
    a: R`<p>区間の長さの和は $\sum\frac2{4^n}=\frac23\lt1$．もし $[0,1]\subset\bigcup_n\left[q_n-\frac1{4^n},q_n+\frac1{4^n}\right]$ なら，σ-劣加法性より $1=m([0,1])\le\frac23$ となり矛盾．したがって普通の意味でも $[0,1]$ を被覆していない（覆われない点がある）．覆われない点 $x$ では，$x$ を含む区間すら存在しないので，当然ヴィタリ被覆ではない．$\square$（有理数に区間を置いても稠密性だけでは覆えない：春学期 [[a1-p2-2d]] の考察と同じ．）</p>` },
]});

X.push({ unit: "b2", section: "b2s7", items: [
  { t: "ex", lab: "レポート", id: "b2-r13-1", num: "13 [1]", lv: 2, pre: ["b2-tbig2", "b2-p4-2", "b2-tbig1"],
    q: R`<p>（大定理1〜3 はすべて使ってよい）関数 $f$ を $[a,b]$ において考える．以下の 2 つは同値であることを証明せよ．(1) $f$ はリプシッツ連続で $|f(x)-f(y)|\le K|x-y|$．(2) $f$ は絶対連続で（したがって a.e. で微分可能）$|f'(x)|\le K$ a.e. $x$．</p>`,
    a: R`<p><b>(1)⇒(2)</b>　命題4-3 よりリプシッツ連続なら絶対連続．大定理1 の系より a.e. で微分可能．微分可能な点 $x$ では $\left|\frac{f(x+h)-f(x)}h\right|\le K$ なので，極限をとって $|f'(x)|\le K$．</p><p><b>(2)⇒(1)</b>　大定理2 より，任意の $x\lt y$ で $f(y)-f(x)=\int_{[x,y]}f'(t)\,dm(t)$．よって $|f(y)-f(x)|\le\int_{[x,y]}|f'|\,dm\le K(y-x)$．$\square$</p><p>（命題4-3 の系では「すべての点で微分可能」でしたが，絶対連続なら a.e. の条件で十分．絶対連続の仮定は外せない：悪魔の階段は $f'=0$ a.e. だがリプシッツ連続でない．）</p>` },
  { t: "ex", lab: "レポート", id: "b2-r13-2", num: "13 [2]", lv: 2, pre: ["a2-dmftrue", "a1-t4-1", "a1-t4-4"],
    q: R`<p>可測関数の定義「任意の実数 $C$ に対して $\{f>C\}$ が可測集合」だけを使って「$f,g$ が可測関数ならば $f+g$ も可測関数」を証明せよ．</p><p><b>補題</b>　次の 2 つは同値：(1) $f(x)+g(x)>C$　(2) ある有理数 $q$ が存在して $f(x)>q$ かつ $g(x)>C-q$．</p><p>問1 補題を証明せよ．問2 $\{f+g>C\}=\bigcup_{q\in\Q}(\{f>q\}\cap\{g>C-q\})$ の右辺が可測集合であることを証明せよ．</p>`,
    a: R`<p><b>問1</b>　(2)⇒(1)：$f(x)+g(x)>q+(C-q)=C$．(1)⇒(2)：$f(x)>C-g(x)$．有理数は稠密だから $C-g(x)\lt q\lt f(x)$ となる有理数 $q$ がとれる．このとき $f(x)>q$，$g(x)>C-q$．</p><p><b>問2</b>　$\{f>q\}$，$\{g>C-q\}$ は可測関数の定義より可測集合．その共通部分は可測（春学期 第 1 章 定理4-4）．$\Q$ は可算集合なので，可算個の可測集合の和として右辺は可測（定理4-1）．補題より左辺と等しいので $\{f+g>C\}$ は可測，すなわち $f+g$ は可測関数．$\square$</p><p>（大定理1 の証明で $A=\bigcup_{p\lt q}A_{p,q}$ と有理数で挟んだのと同じアイデア．）</p>` },
  { t: "ex", lab: "研究レポート", id: "b2-rr13", num: "13", lv: 2, pre: ["b2-r13-2"],
    q: R`<p>可測関数の定義「任意の実数 $C$ に対して $\{f>C\}$ が可測集合」だけで「$f,g$ が可測関数ならば $fg$ も可測関数」を証明せよ．ヒント：まず $f^2$ が可測関数であることを証明しよう．これがわかると $(f+g)^2$ が可測関数であることが分かりますね．</p>`,
    a: R`<p><b>$f^2$ は可測</b>：$C\lt0$ なら $\{f^2>C\}=\R$（可測）．$C\ge0$ なら $\{f^2>C\}=\{f>\sqrt C\}\cup\{f\lt-\sqrt C\}$．$\{f\lt-\sqrt C\}=\bigcup_n\{f\le-\sqrt C-\frac1n\}=\bigcup_n\{f>-\sqrt C-\frac1n\}^c$ も可測．よって可測．</p><p><b>定数倍・符号</b>：$c>0$ なら $\{cf>C\}=\{f>\frac Cc\}$．$\{-g>C\}=\{g\lt-C\}$ も上と同様に可測．よって $-g$，$cf$ は可測．</p><p><b>結論</b>：レポート 13 [2] より $f+g$，$f-g=f+(-g)$ は可測，上より $(f+g)^2$，$(f-g)^2$ も可測．</p>$$fg=\frac14\left\{(f+g)^2-(f-g)^2\right\}$$<p>は可測関数の差（$(f+g)^2+(-(f-g)^2)$）の定数倍なので可測関数．$\square$</p>` },
]});
})();
