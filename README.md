# Claude Bonus Timer 🎰

Claude の2倍ボーナスタイム（2026年3月キャンペーン）を**パチスロ風UI**で可視化するChrome拡張機能です。

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)

## 機能

- **GOGO!ランプ** — ボーナス中は赤く点灯、ランダムでレインボー演出（プレミア確定風）
- **777リール** — ボーナス時は赤7が揃い、通常時は暗転
- **リアルタイムカウントダウン** — 次のボーナス開始/終了まで1秒単位で表示
- **タイムラインバー** — 本日のボーナス/通常時間帯を可視化（現在位置インジケーター付き）
- **スケジュール一覧** — キャンペーン全日程をカレンダー表示
- **バッジ表示** — ツールバーアイコンにボーナス中は赤で `x2`、通常時はグレーで `x1`
- **演出エフェクト** — LEDボーダー、パーティクル、フラッシュ演出

## ボーナスタイム スケジュール（JST）

| 時間帯 | 倍率 |
|--------|------|
| **平日 4:00〜22:00** | **x2 ボーナス** |
| 平日 22:00〜翌4:00 | x1 通常（ピーク） |
| **週末 終日** | **x2 ボーナス** |

キャンペーン期間: **2026年3月13日〜3月27日**

## インストール

1. このリポジトリをクローンまたはダウンロード

```bash
git clone https://github.com/HaL-Fujita/claude-bonus-timer.git
```

2. Chrome で `chrome://extensions/` を開く
3. 右上の **「デベロッパーモード」** をONにする
4. **「パッケージ化されていない拡張機能を読み込む」** をクリック
5. ダウンロードした `claude-bonus-timer` フォルダを選択

ツールバーにアイコンが表示されたら完了です。クリックするとポップアップが開きます。

## スタンドアロン版

Chrome拡張を使わず、ブラウザで直接開くこともできます。

```bash
open index.html
```

## 対象プラン

- Free / Pro / Max / Team（自動適用・設定不要）
- Enterprise は対象外

## ファイル構成

```
claude-bonus-timer/
├── manifest.json      # Chrome拡張マニフェスト（V3）
├── background.js      # バッジ更新サービスワーカー
├── popup.html         # ポップアップUI
├── popup.css          # パチスロ風スタイル
├── popup.js           # ボーナス判定・タイマーロジック
├── index.html         # スタンドアロン版（ブラウザ直接表示用）
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```
