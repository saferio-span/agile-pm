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
import Link from 'next/link';


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
            <DrawerHeader>Menu</DrawerHeader>
  
            <DrawerBody>
              <ul className="list-group mt-3">
  
                  <Link href={`/dashboard`}>
                    <button type="button" className="list-group-item list-group-item-action">Dashboard</button>
                  </Link>
                  <Link href={`/roles`}>
                    <button type="button" className="list-group-item list-group-item-action">Roles</button>
                  </Link>
                  <Link href={`/users`}>
                    <button type="button" className="list-group-item list-group-item-action">Users</button>
                  </Link>
                  
              </ul>
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  export default LeftDrawer;