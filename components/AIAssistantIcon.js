import React from "react";
import Svg, { Path, Circle, G, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from "react-native-svg";

export default function AIAssistantIcon({ size = 30, color = "#fff" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 39 39" fill="none">
      <Defs>
        <Filter id="filter0_d" x="0" y="1.19209e-07" width="38.7418" height="38.1919" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="0.922422" />
          <FeGaussianBlur stdDeviation="1.15303" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </Filter>
        <Filter id="filter1_d" x="5.41923" y="8.84394" width="7.60998" height="7.60998" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="0.922422" />
          <FeGaussianBlur stdDeviation="1.15303" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </Filter>
        <Filter id="filter2_d" x="11.415" y="11.8417" width="7.60998" height="7.60998" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="0.922422" />
          <FeGaussianBlur stdDeviation="1.15303" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </Filter>
      </Defs>
      
      {/* 猫头轮廓 */}
      <G filter="url(#filter0_d)">
        <Path
          d="M3.11317 34.1564C3.11317 34.1564 3.11317 10.2088 3.11317 8.5531C3.11317 7.09934 5.95761 2.78089 7.5881 2.21726C7.95116 2.09175 8.21584 2.44614 8.28152 2.82463C8.47449 3.93669 8.98068 6.33892 9.97332 8.00247C10.0116 8.06657 10.0552 8.12767 10.1137 8.17399C10.8728 8.77478 12.8425 7.97696 13.6057 8.5531C14.705 9.38293 14.7117 10.9223 16.0271 11.2111C17.5588 11.5475 18.4605 8.43961 19.7059 7.45182C19.8554 7.33322 20.0336 7.34531 20.121 7.51499C20.532 8.31345 21.3692 11.0618 21.4463 12.7642C21.4463 16.1576 21.1004 23.2567 21.1004 23.2567M21.1004 23.2567C21.1004 23.2567 17.4107 19.913 15.3353 19.3365C13.2598 18.7599 10.9538 21.4119 11.7609 23.2567C12.568 25.1016 15.4176 27.7481 17.0648 27.6382C18.7943 27.5229 21.1004 23.2567 21.1004 23.2567ZM21.1004 23.2567C21.1004 23.2567 26.1423 14.8622 28.0186 11.7265C28.9439 10.18 29.8634 8.3827 30.5552 7.69088C31.247 6.99907 32.0607 6.73167 32.9766 6.99907C33.8503 7.25413 34.4535 7.80713 35.052 8.5531C35.4901 9.09903 35.6285 10.1122 35.6285 10.1122"
          stroke={color}
          strokeWidth="1.61424"
          strokeLinecap="round"
        />
      </G>
      
      {/* 左眼 */}
      <G filter="url(#filter1_d)">
        <Circle cx="9.22422" cy="11.7265" r="1.49893" fill={color} />
      </G>
      
      {/* 右眼 */}
      <G filter="url(#filter2_d)">
        <Circle cx="15.22" cy="14.7243" r="1.49893" fill={color} />
      </G>
    </Svg>
  );
}
