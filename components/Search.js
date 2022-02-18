import React from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup,  InputLeftElement} from '@chakra-ui/react'

function Search() {
  return (
    <InputGroup>
        <InputLeftElement
        pointerEvents='none'
        children={<SearchIcon color='gray.300' />}
        />
        <Input type='tel' placeholder='Search here...' />
    </InputGroup>
  )
}

export default Search