import React, { memo } from 'react';
import { Circle, Image } from 'react-native-svg';
import { getFruitImageUri } from '../../constants/imageAssets';

const FruitComponent = memo(({ fruit }) => {
  const imageUri = getFruitImageUri(fruit.fruitId);
  const radius = fruit.radius || 20;
  
  return (
    <g transform={`translate(${fruit.x}, ${fruit.y}) rotate(${fruit.rotation})`}>
      {imageUri ? (
        <Image
          href={imageUri}
          x={-radius}
          y={-radius}
          width={radius * 2}
          height={radius * 2}
        />
      ) : (
        <Circle
          cx={0}
          cy={0}
          r={radius}
          fill={`hsl(${fruit.fruitId * 30}, 70%, 60%)`}
        />
      )}
    </g>
  );
});

export const FruitRenderer = memo(({ fruits, gameWidth, gameHeight }) => {
  return (
    <>
      {fruits.map(fruit => (
        <FruitComponent key={fruit.id} fruit={fruit} />
      ))}
    </>
  );
});

export default FruitRenderer;