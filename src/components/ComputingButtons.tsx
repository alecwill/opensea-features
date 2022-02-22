import { useUser } from '../utils/user'
import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Flex,
  Link,
  Spinner,
  HStack,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  Progress,
  useColorModeValue,
  Image,
  Modal,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Table,
  Icon,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import Logo from './Logo'
import { BiReceipt } from 'react-icons/bi'
import { fetchAllCollectionsForUser, fetchFloorPrice } from '../utils/api'
import EthereumIcon from './EthereumIcon'
import ScopedCSSPortal from './ScopedCSSPortal'

const ComputingButtons = ({ type }: { type: 'items' }) => {
  return (
    <Box
      px={3}
      width="100vw"
      maxWidth="480px"
      display="flex"
      color={useColorModeValue('black', 'gray.50')}
    >
      <Box display="flex" justify-content="flex-start" padding="2px">
        <Button variant="outline">Show Rarities</Button>
      </Box>
      <Box display="flex" justify-content="center" padding="2px">
        <Button variant="outline">Trait Sniffer</Button>
      </Box>
      <Box display="flex" justify-content="flex-end" padding="2px">
        <Button variant="outline">Compute Rarities</Button>
      </Box>
    </Box>
  )
}

export default ComputingButtons
