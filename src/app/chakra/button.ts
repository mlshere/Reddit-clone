import {  ComponentStyleConfig } from '@chakra-ui/react';


export const Button: ComponentStyleConfig = {
    baseStyle: {
        borderRadius: "60px",
        color: "brand.100",
        border: "2px solid blue.500",
    },
    sizes: {
        sm: {
            fontSize: "8pt",
        },
        md: {
            fontSize: "10pt",
        },
    },
    variants: {
        solid: {
            color: "white",
            bg: "blue.500",
            _hover: {
                bg: "blue.400",
            },  
        },
        outline: {
            color: "blue.500",
            border: "1px solid",
            borderColor: "blue.500",
        },
        oauth: {
            height: "34px",
            border: "1px solid",
            borderColor: "blue.500",
            _hover: {
                bg: "blue.400",
            },  
        },
    },
};
    
    
 