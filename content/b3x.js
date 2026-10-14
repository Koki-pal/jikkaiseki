(function () {
const R = String.raw;
const X = (window.EXTRA = window.EXTRA || []);
/* b3: レポート問題・研究レポートと解答 */

X.push({ unit: "b3", section: "b3s1", items: [
  { t: "ex", lab: "レポート", id: "b3-r1-1", num: "1 [1][2]", lv: 1, pre: ["b3-dirac"],
    q: R`<p>[1] ディラック測度が完全加法性を満たすことを証明せよ．[2] 計数測度が完全加法性を満たすことを証明せよ（ヒント：1 つでも無限集合があれば…）．</p>`,
    a: R`<p>$\{A_n\}$ を互いに素な集合列，$A=\bigcup A_n$ とする．</p><p>[1] $0\in A$ なら，互いに素なので $0$ を含む $A_k$ はちょうど 1 つ．左辺 $\delta_0(A)=1$，右辺 $\sum\delta_0(A_n)=\delta_0(A_k)=1$．$0\notin A$ ならどの $A_n$ も $0$ を含まず両辺 $0$．$\delta_0(\phi)=0$ も明らか．</p><p>[2] ・$A$ が有限集合なら，空でない $A_n$ は有限個でそれぞれ有限集合．互いに素なので元の個数は足し算でき $\mu(A)=\sum\mu(A_n)$．・$A$ が無限集合なら左辺 $=\infty$．このとき，ある $A_n$ が無限集合なら右辺も $\infty$．すべての $A_n$ が有限集合なら，空でない $A_n$ は無限個あるはず（有限個の有限集合の和は有限）なので $\sum\mu(A_n)\ge\sum1=\infty$．よって等しい．$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b3-r1-3", num: "1 [3]", lv: 1, pre: ["b3-dsm"],
    q: R`<p>例5（$f(x)=x$ の $m_f$）が条件 (3) を満たさないことを証明せよ．ヒント：$m_f(A)=\infty$，$m_f(B)=-\infty$ となる 2 つの集合を見つけるということ．</p>`,
    a: R`<p>$A=(0,\infty)$ なら $m_f(A)=\int_0^\infty x\,dx=\infty$，$B=(-\infty,0)$ なら $m_f(B)=\int_{-\infty}^0x\,dx=-\infty$．$-\infty$ の値をとるので条件 (3) に反する．さらに $\R^1=A\cup\{0\}\cup B$ に対して $m_f(\R^1)$ は $\infty-\infty$ となり定義できない（$\int_{\R^1}x\,dm$ は $x^+,x^-$ の積分がともに $\infty$ でルベーグ積分として意味を持たない）．$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b3-rr1", num: "1", lv: 2, pre: ["b3-dsm", "b1-dm2"],
    q: R`<p>完全加法的集合関数は 2 次元でも同様に考えられます．以下の 3 つの集合関数は非負値完全加法的集合関数（2 次元の測度）であることを確認せよ（条件 (2) 完全加法性を確認する）．</p><p>(i) $A_0=A\cap\{(x,0):x\in\R\}$（$x$ 軸との共通部分）とし $\mu_2(A)=m_1(A_0)$（$x$ 軸上の 1 次元ルベーグ測度）．(ii) 2 次元ディラック測度 $\mu_2(A)=1\ ((0,0)\in A)$，$0$（その他）．(iii) 2 次元のルベーグ可測関数 $f(x,y)$ に対して $\mu_2(A)=\int_A|f(x,y)|\,dm_2(x,y)$．</p>`,
    a: R`<p>$\{A_n\}$ を互いに素，$A=\bigcup A_n$ とする．</p><p>(i) $A_0=\bigcup(A_n)_0$ で $(A_n)_0$ も互いに素．1 次元ルベーグ測度の完全加法性より $m_1(A_0)=\sum m_1((A_n)_0)$．<b>注意</b>：2 次元ルベーグ可測集合 $A$ でも $A_0$ が 1 次元可測とは限らない（$x$ 軸上の非可測集合 $N\times\{0\}$ は 2 次元零集合なので 2 次元可測）．したがって $\mu_2$ は「$A_0$ が 1 次元可測となる集合」（例えばボレル集合）の上で考える必要がある．</p><p>(ii) 1 次元のディラック測度と同じ：$(0,0)$ を含む $A_n$ は高々 1 つ．</p><p>(iii) $\chi_A|f|=\sum_n\chi_{A_n}|f|$（各点で高々 1 項が 0 でない）．非負関数の項別積分（単調収束定理，2 次元版）より $\int_A|f|=\sum\int_{A_n}|f|$．$\square$</p>` },
]});

X.push({ unit: "b3", section: "b3s2", items: [
  { t: "ex", lab: "レポート", id: "b3-r2-1", num: "2 [1]", lv: 1, pre: ["b3-p2-1"],
    q: R`<p>命題2-1′ を証明せよ．(1) $A$ が負集合のとき，任意の $B\subset A$ も負集合で $\mu(B)\ge\mu(A)$．(2) $A_1,A_2$ が負集合ならば $A_1\cup A_2$ も負集合である．</p>`,
    a: R`<p>(1) $C\subset B$ なら $C\subset A$ なので $\mu(C)\le0$．よって $B$ は負集合．$\mu(A)=\mu(B)+\mu(A\setminus B)$ で $A\setminus B\subset A$ より $\mu(A\setminus B)\le0$．よって $\mu(A)\le\mu(B)$．</p><p>(2) $A_1\cup A_2=A_1\cup(A_2\setminus A_1)$（互いに素，$A_2\setminus A_1$ は (1) より負集合）．$C\subset A_1\cup A_2$ に対して $\mu(C)=\mu(C\cap A_1)+\mu(C\cap(A_2\setminus A_1))\le0$．$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b3-r2-2", num: "2 [2]", lv: 1, pre: ["b3-t2-1", "b3-puniq"],
    q: R`<p>$\mu=m_f$ のとき $|\mu|(A)=m_{|f|}(A)$ を証明せよ．（左辺は $\mu$ の全変動．$|m_f(A)|=\left|\int_Af\,dm\right|$ は全変動ではない．）</p>`,
    a: R`<p>$B=\{x:f(x)>0\}$ とおくと，$C\subset B$ なら $\mu(C)=\int_Cf\ge0$ なので $B$ は正集合，同様に $B^c=\{f\le0\}$ は負集合．よって $\R^1=B\cup B^c$ はハーン分解で，ジョルダン分解は（一意性より）</p>$$\mu^+(A)=\int_{A\cap B}f\,dm=\int_Af^+\,dm,\qquad-\mu^-(A)=-\int_{A\cap B^c}f\,dm=\int_A(-f^-)\,dm.$$<p>したがって $|\mu|(A)=\int_A(f^++(-f^-))\,dm=\int_A|f|\,dm=m_{|f|}(A)$．$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b3-r2-3", num: "2 [3]", lv: 1, pre: ["b3-p2-3"],
    q: R`<p>命題2-3′「$A_1\supset A_2\supset\cdots$ で $\mu(A_1)\lt\infty$ のとき $\mu\left(\bigcap A_n\right)=\lim\mu(A_n)$」を証明せよ．</p>`,
    a: R`<p><b>有限性</b>：$\mu(A_1)=\mu(A_n)+\mu(A_1\setminus A_n)$ で，どちらの項も $-\infty$ にはならないので，$\mu(A_1)\lt\infty$ から $\mu(A_n)\lt\infty$，$\mu(A_1\setminus A_n)\lt\infty$．すなわち出て来る値はすべて有限．</p><p>$A=\bigcap A_n$ とすると $A_1=A\cup(A_1\setminus A_2)\cup(A_2\setminus A_3)\cup\cdots$（互いに素，春学期 レポート 4 [2] と同じ分解）．完全加法性より</p>$$\mu(A_1)=\mu(A)+\sum_{n=1}^\infty(\mu(A_n)-\mu(A_{n+1}))=\mu(A)+\mu(A_1)-\lim_{N\to\infty}\mu(A_N).$$<p>$\mu(A_1)$ は有限なので両辺から引いて $\lim\mu(A_N)=\mu(A)$．$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b3-rr2", num: "2", lv: 1, pre: ["b3-t3-1"],
    q: R`<p>1 次元の符号付き測度 $\mu(A)=1\ (0\in A\ \text{かつ}\ 1\notin A)$，$-1\ (1\in A\ \text{かつ}\ 0\notin A)$，$0$（その他）について，$\R^1$ を $\mu$ に関してハーン分解せよ．（ディラック測度に $\pm$ がついた感じです：$\mu=\delta_0-\delta_1$．）</p>`,
    a: R`<p>$\mu=\delta_0-\delta_1$ である（両方含めば $1-1=0$）．$0$ を含み $1$ を含まない集合 $B$ をとればよい．例えば $B=\left(-\infty,\frac12\right)$，$B^c=\left[\frac12,\infty\right)$．$C\subset B$ なら $1\notin C$ なので $\mu(C)=\delta_0(C)\ge0$（正集合），$C\subset B^c$ なら $0\notin C$ なので $\mu(C)=-\delta_1(C)\le0$（負集合）．$\square$</p>` },
]});

X.push({ unit: "b3", section: "b3s4", items: [
  { t: "ex", lab: "レポート", id: "b3-r3-1", num: "3 [1]", lv: 1, pre: ["b3-ddirac2"],
    q: R`<p>以下の符号付き測度 $\mu$ に関する $\mu(A)$ を計算せよ．(1) $\mu=3\delta_{-1}-2\delta_1$ のとき $\mu([-1,1]),\ \mu((-1,1)),\ \mu(\R^1),\ \mu(\{1\})$　(2) $\mu=\sum_{n=1}^\infty\frac1n\delta_n$ のとき $\mu(\R^1)$　(3) $\mu=\sum_{n=1}^\infty\frac{(-1)^{n-1}}n\delta_n$ のとき $\mu(\R^1)$</p>`,
    a: R`<p>(1) $\mu([-1,1])=3-2=1$，$\mu((-1,1))=0$，$\mu(\R^1)=1$，$\mu(\{1\})=-2$．</p><p>(2) $\mu(\R^1)=\sum\frac1n=\infty$（調和級数．測度は $\infty$ の値をとってよい）．</p><p>(3) $\mu(\R^1)=\sum\frac{(-1)^{n-1}}n=\log2$（微分積分学：$\log(1+x)$ のテイラー展開で $x=1$，アーベルの定理）．<b>注意</b>：この $\mu$ は本当の定義の符号付き測度にはならない．奇数全体 $O$ では $\mu(O)=\sum\frac1{2k-1}=\infty$，偶数全体 $E$ では $\mu(E)=-\sum\frac1{2k}=-\infty$ となり条件 (3) に反する．$\R^1$ の値 $\log2$ も，足す順番を変えると変わってしまう（条件収束）．</p>` },
  { t: "ex", lab: "レポート", id: "b3-r3-2", num: "3 [2]", lv: 1, pre: ["a1-cantor"],
    q: R`<p>$C$ をカントール集合とし $\mu(A)=(A\cap C$ に含まれる点の個数）（無限個の場合は $\infty$）と定義する．$\mu\left(\left(\frac13,\frac23\right)\right)$，$\mu\left(\left[\frac13,\frac23\right]\right)$，$\mu\left(\left(\frac29,\frac13\right)\right)$ を求めよ．</p>`,
    a: R`<p>$\left(\frac13,\frac23\right)$ は最初に取り除かれた区間なので $C$ の点を含まない：$\mu=0$．$\left[\frac13,\frac23\right]\cap C=\left\{\frac13,\frac23\right\}$ なので $\mu=2$．$\left(\frac29,\frac13\right)$ は第 2 段階で残る区間 $\left[\frac29,\frac13\right]$ の内部で，例えば $\frac{20}{81}$ のように $C$ の点を無限個含む（$\left[\frac29,\frac13\right]\cap C$ は $C$ を $\frac19$ 倍して平行移動したもので非可算）：$\mu=\infty$．</p>` },
  { t: "ex", lab: "研究レポート", id: "b3-rr3", num: "3", lv: 1, pre: ["b3-puniq"],
    q: R`<p>$\mu=\delta_0-\delta_1$ をハーン分解すると $\R^1=\left(-\infty,\frac12\right)\cup\left[\frac12,\infty\right)=\left(-\infty,\frac13\right)\cup\left[\frac13,\infty\right)=\cdots$ のように答えがたくさんあります．命題2-4（ハーン分解の一意性）と矛盾していないことを説明せよ．</p>`,
    a: R`<p>$B_1=\left(-\infty,\frac12\right)$，$B_2=\left(-\infty,\frac13\right)$ とすると $B_1\ominus B_2=\left[\frac13,\frac12\right)$．これは $0$ も $1$ も含まないので，その任意の部分集合 $C$ について $\mu(C)=0$．すなわち $B_1\ominus B_2$ は正集合かつ負集合で，命題2-4 の主張どおり．ハーン分解は「測度 0 の違いを除いて」一意なのであって，集合として一意なのではない．ジョルダン分解 $\mu^+=\delta_0$，$-\mu^-=\delta_1$ はどの分解からも同じになる．</p>` },
]});

X.push({ unit: "b3", section: "b3s5", items: [
  { t: "ex", lab: "レポート", id: "b3-r4-1", num: "4 [1]", lv: 1, pre: ["b3-dsm"],
    q: R`<p>符号付き測度の場合は「$A\subset B\Rightarrow\mu(A)\le\mu(B)$」が成り立たない $\mu$ と集合 $A,B$ を見つけよ．</p>`,
    a: R`<p>$\mu=-\delta_0$，$A=\phi\subset B=\{0\}$ とすると $\mu(A)=0>\mu(B)=-1$．あるいは $f=-\chi_{(0,1)}$ の $m_f$ で $A=\left(0,\frac12\right)\subset B=(0,1)$：$m_f(A)=-\frac12>m_f(B)=-1$．</p>` },
  { t: "ex", lab: "レポート", id: "b3-r4-2", num: "4 [2]", lv: 1, pre: ["b3-t2-1", "b3-dac"],
    q: R`<p>$\mu$ がルベーグ測度に関して絶対連続ならば $\mu^+$ と $-\mu^-$ もルベーグ測度に関して絶対連続であることを証明せよ．</p>`,
    a: R`<p>ハーン分解 $\R^1=B\cup B^c$ により $\mu^+(A)=\mu(A\cap B)$，$\mu^-(A)=\mu(A\cap B^c)$．$m(A)=0$ なら $m(A\cap B)\le m(A)=0$，$m(A\cap B^c)=0$．$\mu$ の絶対連続性より $\mu(A\cap B)=\mu(A\cap B^c)=0$．よって $\mu^+(A)=0$，$-\mu^-(A)=0$．$\square$（ルベーグ測度 $m$ は非負なので部分集合の測度が小さいことが使える．）</p>` },
  { t: "ex", lab: "レポート", id: "b3-r4-3", num: "4 [3]", lv: 1, pre: ["b3-dsing"],
    q: R`<p>補題2 で出てきた 2 つの測度の関係を簡単な例で練習しよう．$m_f(K)=0$ かつ $m_g(K^c)=0$ となる集合 $K$ をみつけよ（答えはたくさんある）．(1) $f=\chi_{(1,2)}$，$g=\chi_{(3,4)}$　(2) $f=\chi_{(-\infty,0]}$，$g=\chi_{[0,\infty)}$</p>`,
    a: R`<p>(1) $K=(3,4)$（または $[2,\infty)$ など）．$m_f(K)=m((1,2)\cap K)=0$，$m_g(K^c)=m((3,4)\cap K^c)=0$．</p><p>(2) $K=(0,\infty)$．$m_f(K)=m((-\infty,0]\cap(0,\infty))=0$，$m_g(K^c)=m([0,\infty)\cap(-\infty,0])=m(\{0\})=0$．（$K=[0,\infty)$ でもよい．）</p><p>このような $K$ があることは $m_f\perp m_g$（§6）を意味する．(2) ではサポート $(-\infty,0]$ と $[0,\infty)$ が 1 点で重なっているが，その 1 点はルベーグ測度 0 なので特異になる．</p>` },
  { t: "ex", lab: "研究レポート", id: "b3-rr4a", num: "4 [1]", lv: 2, pre: ["b3-p5-1"],
    q: R`<p>$\mu(\R^1)=\infty$ の場合は命題5-1 が成り立たない例をあげよ．すなわち $m(A)=0\Rightarrow\mu(A)=0$ は成り立つが，命題5-1 の $(\star)$ は成り立たないような $\mu$ の例をあげよ．ヒント：$\mu=m_f$ で反例が作れる．$f$ がルベーグ積分可能でなかったら…</p>`,
    a: R`<p>$f(x)=x^2$，$\mu=m_f$ とする．$m(A)=0$ なら $\int_Ax^2\,dm=0$ なので絶対連続．しかし $\eps=1$ に対してどんな $\delta>0$ をとっても，$A_N=\left[N,N+\frac\delta2\right)$ は $m(A_N)\lt\delta$ なのに $\mu(A_N)\ge N^2\frac\delta2\to\infty$．よって $(\star)$ は成り立たない．（$f=\frac1{\sqrt{|x|}}\chi_{(-1,1)}$ のように有限区間で発散する例ではだめで（可積分なので成り立つ），積分が発散することが必要．$f=\frac1x\chi_{(0,1)}$ でも $A=(0,\delta/2)$ で $\mu(A)=\infty$ となり反例．）$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b3-rr4b", num: "4 [2]（定理5-1′）", lv: 3, pre: ["b3-t5-1", "a2-t4-5", "a2-t5-1"],
    q: R`<p><b>定理5-1′（σ-有限な場合のラドン・ニコディムの定理）</b>　$\mu$ は測度（非負）とし，任意の自然数 $N$ に対して $\mu(I_N)\lt\infty$（$I_N=[-N,N]$）を仮定する．$\mu$ がルベーグ測度に関して絶対連続ならば，あるルベーグ可測関数 $f\ge0$ が存在して $\mu(A)=\int_Af\,dm$．</p><p>証明：$\mu_N(A)=\mu(A\cap I_N)$ は有限測度だから定理5-1 よりルベーグ可積分関数 $f_N$ が存在して $\mu_N(A)=\int_Af_N\,dm$（$|x|>N$ で $f_N=0$ としてよい）．問1：$f_N=f_{N+1}$ a.e. on $[-N,N]$ を証明せよ．$f=f_1\ (|x|\le1)$，$f_{N+1}\ (N\lt|x|\le N+1)$ と定義する．問2：$\mu(A)=\int_Af\,dm$ を証明せよ．</p>`,
    a: R`<p><b>$f_N=0$ on $|x|>N$ としてよいこと</b>：$\mu_N(\{|x|>N\})=0$ なので $\int_{\{|x|>N\}}f_N=0$，$f_N\ge0$（$\mu_N\ge0$ なので $f_N\ge0$ a.e. としてよい）より a.e. で 0．0 に取り替えても積分は変わらない．</p><p><b>問1</b>：$A\subset I_N$ なら $\mu_N(A)=\mu(A)=\mu_{N+1}(A)$．よって $\int_A(f_N-f_{N+1})\,dm=0$ がすべての可測集合 $A\subset I_N$ で成り立つ．$g=(f_N-f_{N+1})\chi_{I_N}$ に春学期 定理4-5（[[a2-t4-5]]）を使うと $g=0$ a.e．すなわち $f_N=f_{N+1}$ a.e. on $I_N$．</p><p><b>問2</b>：問1 を繰り返すと，各 $N$ について $f=f_N$ a.e. on $I_N$（$I_N$ の各輪 $N'-1\lt|x|\le N'$ で $f=f_{N'}=f_{N'+1}=\cdots=f_N$ a.e.）．よって</p>$$\mu(A\cap I_N)=\mu_N(A)=\int_Af_N\,dm=\int_{A\cap I_N}f_N\,dm=\int_{A\cap I_N}f\,dm.$$<p>$N\to\infty$ とすると，左辺は測度の単調収束定理で $\mu(A)$，右辺は $f\chi_{A\cap I_N}\uparrow f\chi_A$ に単調収束定理を使って $\int_Af\,dm$（$\infty=\infty$ もありうる）．よって $\mu(A)=\int_Af\,dm$．$\square$</p>` },
]});

X.push({ unit: "b3", section: "b3s6", items: [
  { t: "ex", lab: "レポート", id: "b3-r5-1", num: "5 [1]", lv: 1, pre: ["b3-p6-1"],
    q: R`<p>命題6-1「ルベーグ測度に関して，絶対連続かつ特異な符号付き測度 $\mu$ は 0 しかない」を証明せよ．</p>`,
    a: R`<p>特異だから $m(A)=0$ かつ $|\mu|(A^c)=0$ となる集合 $A$ がある．任意の集合 $C$ に対して $C=(C\cap A)\cup(C\cap A^c)$．$m(C\cap A)\le m(A)=0$ なので絶対連続性より $\mu(C\cap A)=0$．$|\mu(C\cap A^c)|\le|\mu|(C\cap A^c)\le|\mu|(A^c)=0$．よって $\mu(C)=0$．$\square$</p>` },
  { t: "ex", lab: "レポート", id: "b3-r5-2", num: "5 [2]〜[4]", lv: 2, pre: ["b3-p6-2", "b3-p6-6"],
    q: R`<p>[2] 命題6-3 を証明せよ．[3] 命題6-5 を証明せよ．[4] 命題6-6 の (2)⇒(3)⇒(1) を証明せよ．</p>`,
    a: R`<p>[2] $\mathrm{supp}\,\mu\subset A$，$\mathrm{supp}\,\nu\subset B$，$A\cap B=\phi$ とする．$|\mu|(A^c)=0$．$A\subset B^c$ なので $|\nu|(A)\le|\nu|(B^c)=0$．集合 $A$ は「$|\nu|(A)=0$ かつ $|\mu|(A^c)=0$」をみたすので $\nu\perp\mu$，すなわち $\mu\perp\nu$．</p><p>[3] (1) $|\mu|((K_1\cap K_2)^c)=|\mu|(K_1^c\cup K_2^c)\le|\mu|(K_1^c)+|\mu|(K_2^c)=0$．$K_1\cap K_2$ はコンパクト．(2) まず $|\mu+\nu|(A)\le|\mu|(A)+|\nu|(A)$ を示す：$\lambda=\mu+\nu$ のハーン分解 $B$ について $|\lambda|(A)=\lambda(A\cap B)-\lambda(A\cap B^c)\le|\mu(A\cap B)|+|\nu(A\cap B)|+|\mu(A\cap B^c)|+|\nu(A\cap B^c)|\le|\mu|(A)+|\nu|(A)$（$|\mu(C)|\le|\mu|(C)$ と加法性）．よって $|\mu+\nu|((K_1\cup K_2)^c)\le|\mu|(K_1^c)+|\nu|(K_2^c)=0$．</p><p>[4] (2)⇒(3)：$|\mu|(A)=0$ なら $\nu^+(A)=0$，$\nu^-(A)=0$ なので $|\nu|(A)=\nu^+(A)-\nu^-(A)=0$．(3)⇒(1)：$|\nu(A)|\le|\nu|(A)=0$．$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b3-rr5a", num: "5 [1]（命題6-4′）", lv: 2, pre: ["b3-p6-2", "b3-t3-1"],
    q: R`<p>命題6-4 の 4 つの命題はすべて同値であることを証明せよ：(0) $\mathrm{supp}\,\mu\subset K$　(1) 任意の $A$ で $\mu(A)=\mu(A\cap K)$　(2) $\mu(A\setminus K)=0$　(3) 任意の $A\subset K^c$ で $\mu(A)=0$．（(3)⇒(0) は $|\mu|(K^c)=0$ を示す必要がある．ハーン分解を使う．）</p>`,
    a: R`<p>(0)⇒(3) と (1)⇔(2)，(3)⇒(2) は命題6-4 の証明．(2)⇒(3)：$A\subset K^c$ なら $A\setminus K=A$ なので $\mu(A)=0$．</p><p>(3)⇒(0)：$\mu$ のハーン分解 $\R^1=B\cup B^c$ を使うと $|\mu|(K^c)=\mu^+(K^c)-\mu^-(K^c)=\mu(K^c\cap B)-\mu(K^c\cap B^c)$．$K^c\cap B$，$K^c\cap B^c$ はどちらも $K^c$ の部分集合なので (3) より $\mu=0$．よって $|\mu|(K^c)=0$，すなわち $\mathrm{supp}\,\mu\subset K$．$\square$</p>` },
  { t: "ex", lab: "研究レポート", id: "b3-rr5b", num: "5 [2]", lv: 2, pre: ["b3-dsing", "b3-t2-1"],
    q: R`<p>$\mu,\nu$ は次の条件を満たすとする．(2-1) $\forall x\in\R^1,\ \mu(\{x\})=0$　(2-2) $\mathrm{supp}\,\nu$ は高々可算集合に含まれる．このとき $\mu\perp\nu$ を証明せよ．</p>`,
    a: R`<p>(2-2) の意味は，高々可算集合 $S=\{s_1,s_2,\dots\}$ があって $|\nu|(S^c)=0$ となること．</p><p><b>1 点の全変動</b>：$\mu$ のハーン分解 $B$ について $|\mu|(\{x\})=\mu(\{x\}\cap B)-\mu(\{x\}\cap B^c)$．$\{x\}\cap B$ と $\{x\}\cap B^c$ の一方は $\{x\}$，他方は $\phi$ なので $|\mu|(\{x\})=|\mu(\{x\})|=0$．</p><p>完全加法性より $|\mu|(S)=\sum|\mu|(\{s_i\})=0$．よって集合 $S$ は $|\mu|(S)=0$，$|\nu|(S^c)=0$ をみたし，$\mu\perp\nu$．$\square$（例：$\mu=m_f$ と離散的な測度 $\sum c_n\delta_{x_n}$ は互いに特異．）</p>` },
]});

X.push({ unit: "b3", section: "b3s7", items: [
  { t: "ex", lab: "レポート", id: "b3-r6-1", num: "6 [1]", lv: 2, pre: ["b3-drs", "b3-p7-1"],
    q: R`<p>例を参考にして，以下のリーマン・スティルチェス積分を計算せよ．</p><p><b>例</b>　$f=x^2$，$g=|x|$ のとき (i) $\int_0^1f\,dg=\int_0^1x^2dx=\frac13$　(ii) $\int_{-1}^1f\,dg=-\int_{-1}^0x^2dx+\int_0^1x^2dx=0$（$x\lt0$ では $g(x_k)-g(x_{k-1})=-(x_k-x_{k-1})$）．</p><p>(1) $f=x^3$，$g=|x|$ のとき $\int_{-1}^0f\,dg$，$\int_{-1}^1f\,dg$．(2) $f=e^x$，$g(x)=x+1\ (x>0)$，$x\ (x\le0)$ のとき (i) $\int_1^2f\,dg$　(ii) $\int_{-1}^1f\,dg$．</p>`,
    hint: R`(2)(ii) は $[-1,1]$ の分割で $x_n=-\eps,\ x_{n+1}=\eps$ として極限を考える．$[-\eps,\eps]$ の上の変形リーマン和 $e^x(g(\eps)-g(-\eps))$ が問題．`,
    a: R`<p>(1) $\int_{-1}^0x^3\,dg=-\int_{-1}^0x^3dx=-\left[\frac{x^4}4\right]_{-1}^0=\frac14$．$\int_{-1}^1x^3\,dg=\frac14+\int_0^1x^3dx=\frac14+\frac14=\frac12$．（$g=|x|$ は $x\lt0$ で単調減少なので厳密には有界変動の場合の定義を使っている．）</p><p>(2) (i) $[1,2]$ では $g(x_k)-g(x_{k-1})=(x_k+1)-(x_{k-1}+1)=x_k-x_{k-1}$ なので $+1$ は意味がなく，$\int_1^2e^x\,dg=\int_1^2e^xdx=e^2-e$．</p><p>(ii) $\int_{-1}^{-\eps}$ と $\int_\eps^1$ は普通のリーマン積分．$[-\eps,\eps]$ では $g(\eps)-g(-\eps)=(\eps+1)-(-\eps)=1+2\eps$ で，変形リーマン和は $e^{-\eps}(1+2\eps)$ と $e^\eps(1+2\eps)$ の間．$\eps\to0$ で $1$ に収束する．よって</p>$$\int_{-1}^1e^x\,dg=\int_{-1}^1e^xdx+e^0\cdot1=e-\frac1e+1.$$<p>普通のリーマン積分 $\int_{-1}^1e^xdx=e-\frac1e$ との違い $+1$ は，$g$ の $x=0$ での跳び（大きさ 1）から来る．$g=x+H(x)$（$H$ はディラック測度を与える階段関数）なので，$\int f\,dg=\int f\,dx+f(0)$．</p>` },
  { t: "ex", lab: "研究レポート", id: "b3-rr6", num: "6", lv: 2, pre: ["b3-t7-3", "b3-t7-2"],
    q: R`<p>リーマン積分に関する 2 つの平均値の定理に相当する等式を証明せよ．</p><p>(1) 第一平均値の定理：$[a,b]$ 上で $f$ が連続で $g$ が単調増加のとき，ある $a\le c\le b$ が存在して $\int_a^bf\,dg=f(c)(g(b)-g(a))$．</p><p>(2) 第二平均値の定理：$[a,b]$ 上で $f,g$ が連続で単調増加のとき，ある $a\le c\le b$ が存在して $\int_a^bf\,dg=f(a)\int_a^cdg+f(b)\int_c^bdg$（$\int_a^cdg=g(c)-g(a)$）．</p>`,
    hint: R`(1) はリーマン積分における第一平均値の定理の証明を思い出そう．(2) には部分積分と (1) を使う．`,
    a: R`<p>(1) $m=\min f$，$M=\max f$ とすると，どの分割でも $m(g(b)-g(a))\le s_g(f,\Delta)\le S_g(f,\Delta)\le M(g(b)-g(a))$ なので $m(g(b)-g(a))\le\int_a^bf\,dg\le M(g(b)-g(a))$．$g(b)=g(a)$ なら両辺 0 で任意の $c$ でよい．そうでなければ $\frac{\int f\,dg}{g(b)-g(a)}\in[m,M]$ で，$f$ は連続なので中間値の定理よりこの値をとる $c$ がある．</p><p>(2) 定理7-3（部分積分）より $\int_a^bf\,dg=f(b)g(b)-f(a)g(a)-\int_a^bg\,df$．$g$ は連続，$f$ は単調増加なので (1) を（$f,g$ の役割を入れかえて）使うと $\int_a^bg\,df=g(c)(f(b)-f(a))$ となる $c$ がある．代入して</p>$$\int_a^bf\,dg=f(b)g(b)-f(a)g(a)-g(c)f(b)+g(c)f(a)=f(a)(g(c)-g(a))+f(b)(g(b)-g(c)).\quad\square$$<p>実際には単調増加ではなく有界変動でよい．</p>` },
]});
})();
