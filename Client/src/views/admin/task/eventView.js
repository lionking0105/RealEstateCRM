import { CloseIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { DrawerFooter, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from "components/spinner/Spinner"
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BiLink } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { getApi } from 'services/api'
import DeleteTask from './components/deleteTask'
import EditTask from './components/editTask'
import { useNavigate } from 'react-router-dom';

const EventView = (props) => {
    const { onClose, isOpen, info, fetchData } = props
    const [data, setData] = useState()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()

    const fetchViewData = async () => {
        if (info) {
            setIsLoding(true)
            let result = await getApi('api/task/view/', info?.event ? info?.event?._def?.extendedProps?._id : info);
            setData(result?.data);
            setIsLoding(false)
        }
    }

    useEffect(() => {
        fetchViewData()
    }, [info])

    const handleViewOpen = () => {
        if (info?.event) {
            navigate(user?.role !== 'admin' ? `/view/${info?.event?._def?.extendedProps?._id}` : `/admin/view/${info?.event?._def?.extendedProps?._id}`)
        }
        else {
            navigate(user?.role !== 'admin' ? `/view/${info}` : `/admin/view/${info}`)
        }
    }
    return (
        <Modal isOpen={isOpen} size={'md'} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader justifyContent='space-between' display='flex' >
                    Task
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                {isLoding ?
                    <Flex justifyContent={'center'} alignItems={'center'} mb={30} width="100%" >
                        <Spinner />
                    </Flex> : <>

                        <ModalBody>
                            <Grid templateColumns="repeat(12, 1fr)" gap={3} >

                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Title </Text>
                                    <Text>{data?.title ? data?.title : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Related To </Text>
                                    <Text>{data?.category ? data?.category : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task start </Text>
                                    <Text>{data?.start ? moment(data?.start).format('L LT') : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task end  </Text>
                                    <Text>{data?.end ? moment(data?.end).format('L LT') : moment(data?.start).format('L')}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Link </Text>
                                    {data?.url ?
                                        <a target='_blank' href={data?.url}>
                                            <IconButton borderRadius="10px" size="md" icon={<BiLink />} />
                                        </a> : '-'
                                    }
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task reminder </Text>
                                    <Text>{data?.reminder ? data?.reminder : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> assignment To  </Text>
                                    <Link to={data?.assignmentTo ? user?.role !== 'admin' ? `/contactView/${data?.assignmentTo}` : `/admin/contactView/${data?.assignmentTo}` : user?.role !== 'admin' ? `/leadView/${data?.assignmentToLead}` : `/admin/leadView/${data?.assignmentToLead}`}>
                                        <Text color='green.400' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.assignmentToName ? data?.assignmentToName : ' - '}</Text>
                                    </Link>
                                </GridItem>
                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task createBy </Text>
                                    <Text>{data?.createByName ? data?.createByName : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task Description</Text>
                                    <Text>{data?.description ? data?.description : ' - '}</Text>
                                </GridItem>
                                <GridItem colSpan={{ base: 12 }} >
                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Task notes </Text>
                                    <Text>{data?.notes ? data?.notes : ' - '}</Text>
                                </GridItem>
                            </Grid>

                        </ModalBody>
                        <DrawerFooter>
                            <IconButton variant='outline' onClick={() => handleViewOpen()} borderRadius="10px" size="md" icon={<ViewIcon />} />
                            <IconButton variant='outline' onClick={() => setEdit(true)} ml={3} borderRadius="10px" size="md" icon={<EditIcon />} />
                            <IconButton colorScheme='red' onClick={() => setDelete(true)} ml={3} borderRadius="10px" size="md" icon={<DeleteIcon />} />

                            <EditTask fetchData={fetchData} isOpen={edit} onClose={setEdit} viewClose={onClose} id={info?.event ? info?.event?._def?.extendedProps?._id : info} />
                            <DeleteTask fetchData={props.fetchData} isOpen={deleteModel} onClose={setDelete} viewClose={onClose} url='api/task/delete/' method='one' id={info?.event ? info?.event?._def?.extendedProps?._id : info} />
                        </DrawerFooter>
                    </>}
            </ModalContent>
        </Modal>
    )
}

export default EventView
