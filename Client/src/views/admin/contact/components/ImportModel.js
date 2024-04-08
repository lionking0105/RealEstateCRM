import { Button, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from 'components/spinner/Spinner'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CommonFileUpload from 'components/commonFileUpload'

const ImportModal = (props) => {
    const { onClose, isOpen, text, customFields } = props
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate();

    const initialValues = {
        contact: ''
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {
            AddData()
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async () => {
        try {
            setIsLoding(true)
            resetForm()

            if (values.contact) {
                onClose();
                navigate('/contactImport', { state: { fileData: values.contact, customFields: customFields } });
            }

        } catch (e) {
            console.log(e);
        }
        finally {
            setIsLoding(false)
        }
    };

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Import Contacts</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                        <GridItem colSpan={{ base: 12 }}>
                            <CommonFileUpload count={values.contact.length} onFileSelect={(file) => setFieldValue('contact', file)} text={text} />
                            <Text mb='10px' color={'red'}> {errors.contact && touched.contact && <>Please Select {text}</>}</Text>
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" variant='brand' onClick={handleSubmit} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Save'}</Button>
                    <Button sx={{
                        marginLeft: 2,
                        textTransform: "capitalize",
                    }} variant="outline"
                        colorScheme="red" size="sm" onClick={() => {
                            onClose()
                            formik.resetForm()
                        }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ImportModal