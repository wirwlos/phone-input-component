import React, {useState} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {VALID_COUNTRY_CODES} from './country_codes';

type Props = {
  value?: string;
  autoFocus?: boolean;
  placeHolderText?: string;
  placeHolderTextColor?: string;
  inputRef?: any;
  errorText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  flagStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
  onChange: (data: {
    fullNumber: string;
    countryCode?: string;
    remainingNumber?: string;
  }) => void;
  disabled?: boolean;
  disableFlags?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const PhoneInputComponent: React.FC<Props> = ({
  value,
  autoFocus,
  placeHolderText,
  placeHolderTextColor,
  disabled,
  disableFlags = false,
  onChange,
  onBlur,
  onFocus,
  inputRef,
  containerStyle,
  contentContainerStyle,
  inputStyle,
  flagStyle,
  errorTextStyle,
  errorText,
}) => {
  const [formattedValue, setFormattedValue] = useState<string>(value || '');
  const [flag, setFlag] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (text: string) => {
    let countryCode: string | undefined = undefined;
    let remainingNumber: string | undefined = undefined;

    if (!text.startsWith('+') && text.length > 0) {
      if (!errorText) {
        setError('Please include the country code (e.g., +1)');
        setFlag('');
        setFormattedValue(text);
        onChange({fullNumber: text});
        return;
      } else {
        setError(errorText);
        setFlag('');
        setFormattedValue(text);
        onChange({fullNumber: text});
        return;
      }
    } else {
      setError(null);
    }

    for (let i = 1; i <= 4; i++) {
      const potentialCode = text.substring(1, i);
      if (VALID_COUNTRY_CODES[potentialCode]) {
        countryCode = potentialCode;
        remainingNumber = text.substring(i).trim();
        setFlag(VALID_COUNTRY_CODES[potentialCode]);
        break;
      }
    }

    const formatted = countryCode
      ? `+${countryCode} ${remainingNumber}`.trim()
      : text;
    setFormattedValue(formatted);

    onChange({
      fullNumber: formatted,
      countryCode,
      remainingNumber,
    });
  };

  return (
    <View
      style={[
        {flexDirection: 'column', alignItems: 'flex-start', width: '100%'},
        containerStyle,
      ]}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            height: 48,
            width: '100%',
          },
          contentContainerStyle,
        ]}>
        {!disableFlags && flag ? (
          <Text style={[{fontSize: 24, marginRight: 10}, flagStyle]}>
            {flag}
          </Text>
        ) : null}
        <TextInput
          ref={inputRef}
          autoFocus={autoFocus}
          editable={!disabled}
          maxLength={20}
          style={[
            {
              backgroundColor: '#2D2D2D',
              borderRadius: 7,
              color: '#FFFFFF',
              paddingVertical: 7,
              height: 48,
              borderWidth: 1,
              paddingHorizontal: 18,
              fontSize: 16,
              fontWeight: '600',
              flex: 1,
            },
            inputStyle,
          ]}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCorrect={false}
          keyboardType={'phone-pad'}
          placeholder={placeHolderText || "Enter Your Phone Number"}
          placeholderTextColor={placeHolderTextColor ?? '#c1c1c1'}
          onChangeText={handleTextChange}
          value={formattedValue}
        />
      </View>
      {error && (
        <Text
          style={[{color: '#E97E70', marginTop: 0, fontSize: 12}, errorTextStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

PhoneInputComponent.defaultProps = {
  containerStyle: {},
  contentContainerStyle: {},
  inputStyle: {},
  flagStyle: {},
  errorTextStyle: {},
};
