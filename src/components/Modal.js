import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export default ({ Header, Body, Footer, isOpen, closePopup }) => {
  return (
    <Modal isOpen={isOpen} onClose={closePopup}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Header />
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <Body />
        </ModalBody>

        <ModalFooter>
          <Footer />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
