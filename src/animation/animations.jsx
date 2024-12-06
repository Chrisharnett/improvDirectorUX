import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import {
  fadeInDefaults,
  containerSpellerVariantDefaults,
  itemSpellerVariantDefaults,
} from "../config/animationConfig";

export const FadeInContainer = ({
  children,
  startAnimation,
  setCueNextAnimation,
}) => {
  const handleAnimationComplete = () => {
    if (setCueNextAnimation) {
      setCueNextAnimation(true);
    }
  };

  return (
    <AnimatePresence>
      {startAnimation && (
        <motion.span
          className="animate-list"
          variants={fadeInDefaults}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onAnimationComplete={handleAnimationComplete}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

FadeInContainer.propTypes = {
  children: PropTypes.node.isRequired,
  startAnimation: PropTypes.bool,
  setCueNextAnimation: PropTypes.func,
};

export const SpellItOutAnimation = ({
  stringToSplit,
  startAnimation,
  setCueNextAnimation,
}) => {
  const elements = stringToSplit?.split("");
  const handleAnimationComplete = () => {
    setCueNextAnimation ? setCueNextAnimation(true) : null;
  };

  return (
    <motion.div
      className="animate-list"
      variants={containerSpellerVariantDefaults}
      initial="hidden"
      animate={startAnimation ? "visible" : "hidden"}
      onAnimationComplete={handleAnimationComplete}
    >
      {elements?.map((letter, index) => (
        <motion.span key={index} variants={itemSpellerVariantDefaults}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

SpellItOutAnimation.propTypes = {
  startAnimation: PropTypes.bool,
  stringToSplit: PropTypes.string.isRequired,
  setCueNextAnimation: PropTypes.func,
};
