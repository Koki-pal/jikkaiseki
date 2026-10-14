(function () {
const R = String.raw;
const X = (window.EXTRA = window.EXTRA || []);
/* b4: レポート問題・研究レポートと解答 */

X.push({ unit: "b4", section: "b4s1", items: [
  { t: "ex", lab: "問", id: "b4-q1", num: "1-1", lv: 1, pre: ["b4-dbanach"],
    q: R`<p>$\|f\|_C=\max_{x\in[0,1]}|f(x)|$ がノルムの公理 (I)〜(IV) を満たすことを証明せよ．</p>`,
    a: R`<p>(I) 絶対値の最大値なので $\ge0$．(II) $\max|f|=0$ ならすべての $x$ で $|f(x)|\le0$，すなわち $f=0$（逆も明らか）．(III) $\max|af(x)|=|a|\max|f(x)|$．(IV) 各 $x$ で $|f(x)+g(x)|\le|f(x)|+|g(x)|\le\|f\|_C+\|g\|_C$．左辺の最大値をとって $\|f+g\|_C\le\|f\|_C+\|g\|_C$．（連続関数なので最大値は存在する．）$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b4-r7-1", num: "7 [1][2]", lv: 1, pre: ["b4-lem12"],
    q: R`<p>[1] 補題「$L^1([0,1])$ のコーシー列 $\{f_n\}$ の適当な部分列 $\{f_{n_k}\}$ がある $f\in L^1$ に $L^1$ ノルムで収束していたら，関数列全体が $f$ に収束する」を証明せよ．</p><p>[2] 命題1-1「関数列 $\{f_n\}$ が $[0,1]$ において $L^1$ ノルムである関数 $f$ に収束していたら，$\{f_n\}$ は $L^1([0,1])$ におけるコーシー列である」を証明せよ．</p><p>[3] チェビシェフの不等式を書け．</p>`,
    a: R`<p>[1] $\forall\eps>0$．コーシー列なので $n,m\ge N_1\Rightarrow\|f_n-f_m\|\lt\eps$．部分列の収束より $k\ge K\Rightarrow\|f_{n_k}-f\|\lt\eps$．$n\ge N_1$ のとき，$k\ge K$ かつ $n_k\ge N_1$ となる $k$ を 1 つとると</p>$$\|f_n-f\|\le\|f_n-f_{n_k}\|+\|f_{n_k}-f\|\lt2\eps.$$<p>よって $\lim\|f_n-f\|_{L^1}=0$．$\square$</p><p>[2] $\forall\eps>0$，$n\ge N\Rightarrow\|f_n-f\|\lt\eps$ となる $N$ をとると，$n,m\ge N$ で $\|f_n-f_m\|\le\|f_n-f\|+\|f-f_m\|\lt2\eps$．$\square$</p><p>[3] $f$ はルベーグ可積分関数とする．$\forall t>0$ に対して $A_t=\{x:|f(x)|\ge t\}$ とおくと $t\,m(A_t)\le\int_{\R^1}|f(x)|\,dm(x)$（[[a2-cheb]]）．</p>` },
  { t: "ex", lab: "研究レポート", id: "b4-rr7", num: "7", lv: 3, pre: ["b4-t1-1"],
    q: R`<p>$(0,1)$ において「$f$ は有界で微分可能，さらに $f'$ が連続で有界」という関数の空間を $C^1((0,1))$ と書き，ノルムを $\|f\|_{C^1}=\sup_{(0,1)}|f|+\sup_{(0,1)}|f'|$ と定義する．$C^1((0,1))$ はバナッハ空間（完備）であることを証明せよ．</p>`,
    hint: R`これは微分積分学の一様収束の問題をノルムを使って書いただけ．`,
    core: R`コーシー列なら $f_n$ と $f_n'$ がそれぞれ一様にコーシー列 → 一様収束：$f_n\to f$，$f_n'\to g$．$f_n(x)=f_n(x_0)+\int_{x_0}^xf_n'$ で極限をとって $f(x)=f(x_0)+\int_{x_0}^xg$，よって $f'=g$．`,
    a: R`<p><b>ノルムの公理</b>：(I)(III)(IV) は sup の性質から明らか．(II) $\|f\|_{C^1}=0$ なら $\sup|f|=0$ で $f=0$．</p><p><b>完備性</b>：$\{f_n\}$ をコーシー列とする．$\sup|f_n-f_m|\le\|f_n-f_m\|_{C^1}$，$\sup|f_n'-f_m'|\le\|f_n-f_m\|_{C^1}$ なので，定理1-1 と同じ議論で（各点で実数のコーシー列，そして一様収束）$f_n\to f$，$f_n'\to g$ が $(0,1)$ 上一様収束する．$g$ は連続関数の一様極限なので連続，また $f,g$ は有界（一様収束の極限で，コーシー列はノルムが有界なので）．</p><p>$x_0\in(0,1)$ を固定すると，微積分の基本定理より $f_n(x)=f_n(x_0)+\int_{x_0}^xf_n'(t)dt$．一様収束なので積分と極限が交換できて $f(x)=f(x_0)+\int_{x_0}^xg(t)dt$．$g$ は連続なので $f$ は微分可能で $f'=g$（連続かつ有界）．よって $f\in C^1((0,1))$．</p><p>最後に $\|f_n-f\|_{C^1}=\sup|f_n-f|+\sup|f_n'-g|\to0$（どちらも一様収束）．よってノルム収束し，$C^1((0,1))$ はバナッハ空間．$\square$</p>` },
]});

X.push({ unit: "b4", section: "b4s2", items: [
  { t: "ex", lab: "レポート", id: "b4-r8-1", num: "8 [1]", lv: 2, pre: ["b4-dmeasconv"],
    q: R`<p>以下の 2 つの命題を証明せよ（測度収束においても測度 0 の集合は無視してよいということ）．</p><p><b>命題2-1</b>　$\{f_n\}$ は $f$ に $[0,1]$ において測度収束している．$f=g$ a.e. on $[0,1]$ ならば $f_n$ は $g$ にも測度収束している．</p><p><b>命題2-2</b>　$\{f_n\}$ が 2 つの可測関数 $f$ と $g$ に $[0,1]$ において測度収束していたら $f=g$ a.e. on $[0,1]$．</p>`,
    hint: R`命題2-1：$A=\{f=g\}$ とおく．命題2-2：$E_t=\{|f-g|>t\}$ とおく．$a+b>t\Rightarrow a>\frac t2$ または $b>\frac t2$．`,
    a: R`<p><b>命題2-1</b>：$A=\{x\in[0,1]:f(x)=g(x)\}$ とおくと $m([0,1]\setminus A)=0$．$x\in A$ なら $|f_n-g|=|f_n-f|$ なので</p>$$\{|f_n-g|\ge t\}\subset\{|f_n-f|\ge t\}\cup([0,1]\setminus A),\qquad m(\{|f_n-g|\ge t\})\le m(\{|f_n-f|\ge t\})+0\to0.$$<p><b>命題2-2</b>：$E_t=\{|f-g|>t\}$ とおく．$|f-g|\le|f-f_n|+|f_n-g|$ なので，$|f-g|>t$ なら $|f-f_n|>\frac t2$ または $|f_n-g|>\frac t2$．よって任意の $n$ で</p>$$m(E_t)\le m(\{|f-f_n|>\tfrac t2\})+m(\{|f_n-g|>\tfrac t2\})\to0\quad(n\to\infty).$$<p>左辺は $n$ によらないので $m(E_t)=0$．$\{f\ne g\}=\bigcup_kE_{1/k}$ なので $m(\{f\ne g\})=0$．$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b4-r8-2", num: "8 [2]", lv: 1, pre: ["a1-q0"],
    q: R`<p>集合 $A_k$ に対して (1) $x\in\bigcap_{K=1}^\infty\bigcup_{k=K}^\infty A_k$ であることと，$x$ が無限個の $A_k$ に含まれていることは同値であることを証明せよ．(2) $x\in\bigcup_{K=1}^\infty\bigcap_{k=K}^\infty A_k$ であることと，$x$ がある番号から先のすべての $A_k$ に含まれていることは同値であることを証明せよ．</p>`,
    a: R`<p>春学期 0 章の問（[[a1-q0]]）と同じ．(1) 左辺 $\iff$「任意の $K$ に対して，ある $k\ge K$ で $x\in A_k$」．$x$ を含む $A_k$ が有限個なら，その番号の最大値 $+1$ を $K$ とすると不成立．無限個なら任意の $K$ より大きい番号がある．(2) 左辺 $\iff$「ある $K$ があって，すべての $k\ge K$ で $x\in A_k$」．これはそのまま「ある番号から先のすべての $A_k$ に含まれる」．$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b4-rr8", num: "8", lv: 3, pre: ["b4-dmeasconv"],
    q: R`<p>$[0,1]$ 上の可測関数全体を $V$ とし，$\|f\|_V=\int_{[0,1]}\frac{|f|}{1+|f|}\,dm$ と定義する（積分の中が 1 以下だから可積分関数でなくても有限）．$\|f\|_V$ はノルムの公理 (III) は満たさないがそれ以外は満たします．</p><p>問1　三角不等式 $\|f+g\|_V\le\|f\|_V+\|g\|_V$ を証明せよ．ヒント：$a,b>0$ のとき $\frac{a+b}{1+a+b}\le\frac a{1+a}+\frac b{1+b}$ は成り立つか？</p><p>問2　$f_n$ が $f$ に測度収束する $\iff\lim\|f_n-f\|_V=0$ を証明せよ．</p>`,
    core: R`$\varphi(u)=\frac u{1+u}$ は単調増加で劣加法的．$\|f_n-f\|_V\le m(E_n(t))+\varphi(t)$ と $\|f_n-f\|_V\ge\varphi(t)m(E_n(t))$ の 2 つの評価．`,
    a: R`<p>$\varphi(u)=\frac u{1+u}=1-\frac1{1+u}\ (u\ge0)$ は単調増加で $0\le\varphi\lt1$，$\varphi(u)\le u$．</p><p><b>問1</b>：$a,b\ge0$ のとき $\varphi(a+b)=\frac a{1+a+b}+\frac b{1+a+b}\le\frac a{1+a}+\frac b{1+b}=\varphi(a)+\varphi(b)$．$|f+g|\le|f|+|g|$ と単調性から $\varphi(|f+g|)\le\varphi(|f|+|g|)\le\varphi(|f|)+\varphi(|g|)$．積分して三角不等式．（(II) は $\int\varphi(|f|)=0\Rightarrow\varphi(|f|)=0$ a.e. $\Rightarrow f=0$ a.e.．(III) は成り立たない：$\|2f\|_V\ne2\|f\|_V$．）</p><p><b>問2</b>：$E_n(t)=\{x\in[0,1]:|f_n-f|\ge t\}$ とおく．</p><p>($\Rightarrow$) $\varphi\le1$ と単調性より</p>$$\|f_n-f\|_V=\int_{E_n(t)}\varphi(|f_n-f|)+\int_{[0,1]\setminus E_n(t)}\varphi(|f_n-f|)\le m(E_n(t))+\varphi(t)\le m(E_n(t))+t.$$<p>$\forall\eps>0$ に対し $t=\frac\eps2$ とし，測度収束より $n$ を大きくすると $m(E_n(t))\lt\frac\eps2$．よって $\|f_n-f\|_V\lt\eps$．</p><p>($\Leftarrow$) $E_n(t)$ 上で $\varphi(|f_n-f|)\ge\varphi(t)$ なので $\|f_n-f\|_V\ge\int_{E_n(t)}\varphi(|f_n-f|)\ge\varphi(t)m(E_n(t))$．よって $m(E_n(t))\le\frac{\|f_n-f\|_V}{\varphi(t)}\to0$．$\square$</p><p>（すなわち測度収束は「距離」$d(f,g)=\|f-g\|_V$ による収束である．ノルムではないが距離空間になる．）</p>` },
  { t: "fix", html: R`<p>資料のレポート 8 [1] 命題2-2 のヒントの「$b>\frac b2$」は「$b>\frac t2$」の誤植．</p>` },
]});

X.push({ unit: "b4", section: "b4s3", items: [
  { t: "ex", lab: "レポート", id: "b4-r9-1", num: "9 [1]", lv: 1, pre: ["b4-tegorov"],
    q: R`<p>(i) $(0,1]$ において $f_n(x)=\frac1{nx}$ を考える．(1) 各点収束する極限 $f$ を求めよ．(2) $\forall\eps>0$ に対してエゴロフの定理の成り立つ閉集合 $F$ を求めよ．</p><p>(ii) $[0,\pi]$ において $f_n(x)=(\sin x)^n$ を考える．(1) 各点収束する極限 $f$ を求めよ．(2) $\forall\eps>0$ に対してエゴロフの定理の成り立つ閉集合 $F$ を求めよ．</p>`,
    a: R`<p>(i) (1) $f=0$（各 $x>0$ で $\frac1{nx}\to0$）．(2) $F=\left[\frac\eps2,1\right]$．$m((0,1]\setminus F)=\frac\eps2\lt\eps$，$F$ 上で $\sup|f_n|=\frac2{n\eps}\to0$ なので一様収束．（$(0,1]$ 全体では $\sup=\infty$ で一様収束しない．）</p><p>(ii) (1) $f(x)=0\ (x\ne\frac\pi2)$，$f(\frac\pi2)=1$．(2) $F=[0,\pi]\setminus\left(\frac\pi2-\frac\eps4,\frac\pi2+\frac\eps4\right)$（閉集合）．$m([0,\pi]\setminus F)=\frac\eps2\lt\eps$．$F$ 上では $0\le\sin x\le\cos\frac\eps4\lt1$ なので $\sup_F|f_n-0|\le\left(\cos\frac\eps4\right)^n\to0$．$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b4-r9-2", num: "9 [2]", lv: 1, pre: ["b4-tlusin"],
    q: R`<p>(i) $f(x)=\frac1x$ を $(0,1]$ において考える．(ii) $f(x)=\sin\frac1x$ を $(0,1]$ において考える．それぞれ $\forall\eps>0$ に対してルジンの定理の成り立つ閉集合 $F$ を求めよ．</p>`,
    a: R`<p>どちらも $(0,1]$ では連続だが，$\R$ の閉集合をとる必要があるので $0$ の近くを除く．$F=\left[\frac\eps2,1\right]$ とすれば $m((0,1]\setminus F)=\frac\eps2\lt\eps$ で，$f$ は $F$ 上連続．（(i) は 0 の近くで非有界，(ii) は 0 の近くで激しく振動するが，それらは小さな測度の部分に押し込められる．）</p>` },
  { t: "ex", lab: "研究レポート", id: "b4-rr9", num: "9", lv: 2, pre: ["b4-tlusin"],
    q: R`<p>$f=\chi_\Q$（ディリクレ関数）を $[0,1]$ において考える．$\forall\eps>0$ に対してルジンの定理の成り立つ閉集合 $F$ を求めよ．ヒント：$f=0$ a.e. です．$F$ 上では関数は 0 になっているはず．でも $\mathbb P\cap[0,1]$（無理数全体）は閉集合ではありません．</p>`,
    a: R`<p>$[0,1]$ の有理数を $q_1,q_2,\dots$ と番号づけし，開区間 $U_n=\left(q_n-\frac\eps{2^{n+2}},q_n+\frac\eps{2^{n+2}}\right)$ をとる．$U=\bigcup U_n$ は開集合で $m(U)\le\sum\frac\eps{2^{n+1}}=\frac\eps2$．</p>$$F=[0,1]\setminus U$$<p>は閉集合（閉集合と開集合の補集合の共通部分）で，有理数を含まない．したがって $F$ 上で $f=0$（定数）なので連続．$m([0,1]\setminus F)\le m(U)\le\frac\eps2\lt\eps$．$\square$</p><p>（$F$ は無理数だけからなる閉集合で，測度が $1-\frac\eps2$ 以上もある．有理数は稠密なのに，閉集合 $F$ は「隙間だらけ」（内点をもたない）であることに注意．）</p>` },
]});

X.push({ unit: "b4", section: "b4s4", items: [
  { t: "ex", lab: "レポート", id: "b4-r10-1", num: "10 [1]", lv: 1, pre: ["b4-dlinf"],
    q: R`<p>次の関数の $\|f\|_{L^\infty(\R^1)}$ を求めよ．(1) $f=\chi_\Q$　(2) $f=\chi_{\mathbb P}$　(3) $f(x)=\sin\frac1x\ (x\ne0)$，$2\ (x=0)$</p>`,
    a: R`<p>(1) $\{|f|>t\}$ は $t\lt1$ で $\Q$（測度 0），$t\ge1$ で $\phi$．すべての $t\ge0$ で測度 0 なので $\|\chi_\Q\|_{L^\infty}=0$．</p><p>(2) $t\lt1$ なら $\{|f|>t\}=\mathbb P$（測度 $\infty$），$t\ge1$ なら $\phi$．よって $\|\chi_{\mathbb P}\|_{L^\infty}=1$．</p><p>(3) $t\ge1$ なら $\{|f|>t\}\subset\{0\}$ で測度 0．$t\lt1$ なら $|\sin\frac1x|>t$ となる $x$ は 0 の近くに区間（正の測度）として無限にある．よって $\|f\|_{L^\infty}=1$（$x=0$ での値 2 は関係しない）．</p>` },
  { t: "ex", lab: "レポート", id: "b4-r10-2", num: "10 [2]", lv: 1, pre: ["b4-p4-4"],
    q: R`<p>$\|fg\|_{L^\infty}\le\|f\|_{L^\infty}\|g\|_{L^\infty}$ を証明せよ．ヒント：命題4-4 の証明のアイデアを使う．</p>`,
    a: R`<p>$s>\|f\|_{L^\infty}$，$t>\|g\|_{L^\infty}$ を任意にとる．「$|f(x)|\le s$ かつ $|g(x)|\le t$ ならば $|f(x)g(x)|\le st$」の対偶より $\{|fg|>st\}\subset\{|f|>s\}\cup\{|g|>t\}$．右辺の測度は 0（命題4-1）なので $m(\{|fg|>st\})=0$，よって $\|fg\|_{L^\infty}\le st$．$s\downarrow\|f\|$，$t\downarrow\|g\|$ として結論．$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b4-rr10", num: "10 [1]〜[3]", lv: 2, pre: ["b4-p4-1"],
    q: R`<p>[1] $\alpha=\sup\{t\ge0:m(\{|f|>t\})>0\}$ としたとき $\alpha=\|f\|_{L^\infty}$ を証明せよ．</p><p>[2] $\beta=\inf\{t\ge0:m(\{|f|\ge t\})=0\}$ としたとき $\beta=\|f\|_{L^\infty}$ を証明せよ．</p><p>[3] $f\in C([0,1])$ のとき $\|f\|_{L^\infty([0,1])}=\|f\|_{C([0,1])}=\max|f|$ を証明せよ（$\|f\|_{L^\infty([0,1])}=\inf\{t\ge0:m(\{x\in[0,1]:|f|>t\})=0\}$）．</p>`,
    a: R`<p>$\|f\|=\|f\|_{L^\infty}$ と書く．</p><p>[1] (i) $t>\|f\|$ なら命題4-1 (1) より $m(\{|f|>t\})=0$ なので $t$ は sup をとる集合に属さない．よって $\alpha\le\|f\|$．(ii) $t\lt\|f\|$ なら命題4-1 (2) より $m(\{|f|>t\})>0$ なので $t$ は集合に属し $\alpha\ge t$．$t\uparrow\|f\|$ として $\alpha\ge\|f\|$．（$\|f\|=0$ なら集合は空で $\alpha=0$ と約束する．）</p><p>[2] (i) $t>\|f\|$ なら $s=\frac{t+\|f\|}2$ について $\{|f|\ge t\}\subset\{|f|>s\}$ で測度 0．よって $\beta\le t$，$t\downarrow\|f\|$ として $\beta\le\|f\|$．(ii) $t\lt\|f\|$ なら $\{|f|\ge t\}\supset\{|f|>t\}$ は正の測度なので $t$ は inf をとる集合に属さない．この集合は「$t$ が属すればそれより大きい数も属する」形なので，$\beta\ge\|f\|$．</p><p>[3] $M=\max|f|=|f(x_0)|$ とする．すべての $x$ で $|f|\le M$ なので $\{|f|>M\}=\phi$，よって $\|f\|_{L^\infty}\le M$．$t\lt M$ なら，$f$ の連続性より $|f(x)|>t$ が $x_0$ のある近傍 $(x_0-\delta,x_0+\delta)\cap[0,1]$（長さ正の区間）で成り立つので $m(\{|f|>t\})>0$，よって $\|f\|_{L^\infty}\ge t$．$t\uparrow M$ で $\|f\|_{L^\infty}=M$．$\square$（連続関数では 1 点の値を変えられないので，a.e. の世界の最大値と普通の最大値が一致する．）</p>` },
]});
})();
