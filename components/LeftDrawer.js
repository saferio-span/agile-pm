import React from 'react';
import ReactDOM from 'react-dom';
// React.useLayoutEffect = React.useEffect 
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react';
  import { useDisclosure } from '@chakra-ui/react';
  import { Button, ButtonGroup } from '@chakra-ui/react';
  import { HamburgerIcon } from '@chakra-ui/icons';
  import { Input } from '@chakra-ui/react';

  const LeftDrawer=()=>{
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
  
    return (
      <>
        <Button ref={btnRef} colorScheme='teal' onClick={onOpen} mr='2'>
            <HamburgerIcon w={8} h={8} color="#ECC94B" />
        </Button>
        <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Add Projects</DrawerHeader>
  
            <DrawerBody>
              <Input placeholder='Project Name...' />
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue'>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  export default LeftDrawer;