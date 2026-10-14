/* Content manifest — which books, units and files make up the site.
 * Files load in the listed order; EXTRA (newSection / section packs) and PATCH packs come after their unit file.
 */
window.MANIFEST = {
  site: {
    title: "実解析学",
    eyebrow: "REAL ANALYSIS · 測度論とルベーグ積分",
    intro: "開区間の長さだけから出発して外測度・可測集合・ルベーグ測度を組み立て（実解析学1 第1章），ルベーグ積分と収束定理（第2章）へ進む．実解析学2 では 2 次元の測度とフビニの定理，微分と積分の関係（ルベーグの微分定理・絶対連続関数），符号付き測度とラドン・ニコディムの定理，ルベーグ空間（L¹・L∞・L²）を扱う．講義資料に沿って書き，定理には直観・証明の核心と流れ・反例や考察を添え，レポート問題と研究レポートにはすべて詳しい解答を付けた．"
  },
  books: [
    {
      id: "ra1",
      title: "実解析学 1",
      label: "実解析学1",
      subtitle: "測度論とルベーグ積分（春学期）",
      eyebrow: "REAL ANALYSIS · 測度論からルベーグ積分まで",
      intro: "開区間の長さだけから出発して外測度・可測集合・ルベーグ測度を組み立て，ルベーグ積分を定義して単調収束定理・ファトゥの補題・優収束定理まで進む．講義資料に沿って，定理には直観・証明の核心と流れ・厳密な証明を添え，レポート問題と研究レポートにはすべて詳しい解答を付けた．",
      units: [
        { id: "a1", chapter: 1, files: ["a1.js", "a1b.js", "a1x.js"] },
        { id: "a2", chapter: 2, files: ["a2.js", "a2b.js", "a2x.js"] }
      ]
    },
    {
      id: "ra2",
      title: "実解析学 2",
      label: "実解析学2",
      subtitle: "秋学期",
      units: [
        { id: "b1", chapter: 1, files: ["b1.js", "b1b.js", "b1x.js"] },
        { id: "b2", chapter: 2, files: ["b2.js", "b2b.js", "b2x.js"] },
        { id: "b3", chapter: 3, files: ["b3.js", "b3b.js", "b3x.js"] },
        { id: "b4", chapter: 4, files: ["b4.js", "b4b.js", "b4x.js"] }
      ]
    }
  ],
  extra: []
};
