import React from 'react';

// 웹용 LinearGradient 목업 구현
const LinearGradient = ({ 
  colors = ['#ffffff', '#000000'], 
  start = { x: 0, y: 0 }, 
  end = { x: 1, y: 1 }, 
  locations,
  style, 
  children, 
  ...props 
}) => {
  // 그라디언트 방향 계산
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);
  
  // CSS 그라디언트 문자열 생성
  let gradientStops = '';
  if (locations && locations.length === colors.length) {
    gradientStops = colors.map((color, index) => 
      `${color} ${locations[index] * 100}%`
    ).join(', ');
  } else {
    gradientStops = colors.join(', ');
  }
  
  const gradientStyle = {
    background: `linear-gradient(${angle}deg, ${gradientStops})`,
    ...style
  };

  return (
    <div style={gradientStyle} {...props}>
      {children}
    </div>
  );
};

export default LinearGradient;
export { LinearGradient };