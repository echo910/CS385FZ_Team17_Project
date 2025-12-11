# MusicCard 组件

一个支持多种 variants 的音乐卡片组件，完全基于 Figma 设计实现。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | 必需 | 卡片标题 |
| `subtitle` | `string` | - | 卡片副标题（某些 variants 需要） |
| `image` | `string` | 必需 | 图片 URL |
| `variant` | `'hero' \| 'square-large' \| 'square-small' \| 'album' \| 'circle'` | `'square-large'` | 卡片变体 |
| `color` | `string` | - | 背景颜色（仅 hero variant） |
| `tagColor` | `string` | `'#FFB6C1'` | 标签颜色（square variants） |
| `showTag` | `boolean` | `true` | 是否显示标签线 |
| `onPress` | `Function` | - | 点击回调函数 |
| `style` | `ViewStyle` | - | 自定义容器样式 |
| `imageStyle` | `ImageStyle` | - | 自定义图片样式 |
| `titleStyle` | `TextStyle` | - | 自定义标题样式 |
| `subtitleStyle` | `TextStyle` | - | 自定义副标题样式 |

## Variants

### 1. Hero
大尺寸的横向卡片，带有背景色和覆盖层。

```jsx
<MusicCard
  variant="hero"
  title="Heartbeat Radar"
  subtitle="Fresh songs\nthat suit your taste"
  image="https://example.com/image.jpg"
  color="#8FB8B4"
  onPress={() => {}}
/>
```

### 2. Square Large
140x140 的方形卡片，带有标签线和标题覆盖层。

```jsx
<MusicCard
  variant="square-large"
  title="陳奕迅合輯"
  image="https://example.com/image.jpg"
  tagColor="#FFD700"
  showTag={true}
  onPress={() => {}}
/>
```

### 3. Square Small
100x100 的小型方形卡片。

```jsx
<MusicCard
  variant="square-small"
  title="方大同合輯"
  image="https://example.com/image.jpg"
  showTag={true}
  onPress={() => {}}
/>
```

### 4. Album
垂直布局的专辑卡片，显示封面、标题和艺术家。

```jsx
<MusicCard
  variant="album"
  title="唯一"
  subtitle="Album · 王力宏"
  image="https://example.com/image.jpg"
  onPress={() => {}}
/>
```

### 5. Circle
圆形头像卡片，用于艺术家展示。

```jsx
<MusicCard
  variant="circle"
  title="告五人"
  image="https://example.com/image.jpg"
  onPress={() => {}}
/>
```

## 使用示例

```jsx
import { MusicCard } from './components';

// Hero card
<MusicCard
  variant="hero"
  title="Daily Mix"
  subtitle="Made for you"
  image="https://i.pravatar.cc/300?img=33"
  color="#9F9FF2"
  onPress={() => console.log('Pressed')}
/>

// Square large with custom tag color
<MusicCard
  variant="square-large"
  title="YELLOW黃宣"
  image="https://i.pravatar.cc/300?img=53"
  tagColor="#FFD700"
  onPress={() => console.log('Pressed')}
/>

// Album card
<MusicCard
  variant="album"
  title="橙月"
  subtitle="Album · 方大同"
  image="https://i.pravatar.cc/300?img=25"
  onPress={() => console.log('Pressed')}
/>
```

## 样式自定义

组件支持通过 `style`、`imageStyle`、`titleStyle` 和 `subtitleStyle` props 进行样式自定义：

```jsx
<MusicCard
  variant="square-large"
  title="Custom Card"
  image="https://example.com/image.jpg"
  style={{ marginRight: 20 }}
  imageStyle={{ borderRadius: 8 }}
  titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
  onPress={() => {}}
/>
```


