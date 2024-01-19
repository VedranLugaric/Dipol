import { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

const FallingAnimation = ({ children }) => {
  const [falling, setFalling] = useState(false);

  useEffect(() => {
    setFalling(true);
  }, []);

  //prilagodi konfiguraciju animacije
  const springProps = useSpring({
    opacity: falling ? 1 : -1,
    transform: falling ? 'translateY(0)' : 'translateY(-50px)',
    config: {
      tension: 90, //brze ili sporije padanje
    },
  });

  return (
    <animated.div style={springProps}>
      {children}
    </animated.div>
  );
};

export default FallingAnimation;
