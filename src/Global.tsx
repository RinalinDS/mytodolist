import {createGlobalStyle} from 'styled-components';

type GlobalType = {
  theme?: {
    body: string
    text: string
  }
}

export const GlobalStyles = createGlobalStyle<GlobalType>`
  body {
    background: ${({theme}) => theme.body};
    color: ${({theme}) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }

  &::-webkit-scrollbar {
    
    height: 10px;
    width: 10px;
    background: gray;
  }

  &::-webkit-scrollbar-thumb:horizontal {
    background: #621ebb;
    border-radius: 20px;   
  }
  &::-webkit-scrollbar-thumb:vertical {
    background: #621ebb;
    border-radius: 20px;
  }

  * {
    box-sizing: border-box;
    font-family: Verdana, Arial, Helvetica, sans-serif;
  }
`;
export const lightTheme = {
  body: '#f1f1f1',
  text: '#121620'
};
export const darkTheme = {
  body: '#121620',
  text: '#f1f1f1'
};