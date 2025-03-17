import { Text, TextStyle, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { useColorScheme } from 'react-native';

interface TypographyProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const createTypographyComponent = (
  fontSize: number,
  fontWeight: TextStyle['fontWeight'] = '400',
  additionalStyle?: TextStyle,
) => {
  return function TypographyComponent({ children, style }: TypographyProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <Text
        style={[
          {
            fontSize,
            fontWeight,
            color: isDark ? colors.dark.text : colors.light.text,
          },
          additionalStyle,
          style,
        ]}>
        {children}
      </Text>
    );
  };
};

export const LargeTitle = createTypographyComponent(34, '400');
export const Title1 = createTypographyComponent(28, '400');
export const Title2 = createTypographyComponent(22, '400');
export const Title3 = createTypographyComponent(20, '400');
export const Headline = createTypographyComponent(17, '600');
export const Body = createTypographyComponent(17, '400');
export const Callout = createTypographyComponent(16, '400');
export const Subhead = createTypographyComponent(15, '400');
export const Footnote = createTypographyComponent(13, '400');
export const Caption1 = createTypographyComponent(12, '400');
export const Caption2 = createTypographyComponent(11, '400');