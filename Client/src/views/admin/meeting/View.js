import { Box, Button, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import moment from "moment";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";
import { getApi } from "services/api";
import { DeleteIcon } from "@chakra-ui/icons";
import { deleteApi } from "services/api";
import CommonDeleteModel from "components/commonDeleteModel";

const View = () => {

    const param = useParams()

    const [data, setData] = useState()
    const [deleteMany, setDeleteMany] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()
    const params = useParams();


    const fetchData = async () => {
        setIsLoding(true)
        let response = await getApi('api/meeting/view/', param.id)
        setData(response?.data);
        setIsLoding(false)
    }
    useEffect(() => {
        fetchData()
    }, [])

    const handleDeleteMeeting = async (ids) => {
        try {
            setIsLoding(true)
            let response = await deleteApi('api/meeting/delete/', params.id)
            if (response.status === 200) {
                setDeleteMany(false)
                navigate(-1)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoding(false)
        }
    }

    const [permission, contactAccess, leadAccess] = HasAccess(['Meetings', 'Contacts', 'Leads'])

    return (
        <>
            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> : <>

                    <Grid templateColumns="repeat(4, 1fr)" gap={3}>

                        <GridItem colSpan={{ base: 4 }}>
                            <Card >
                                <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                    <GridItem colSpan={2}>
                                        <Box>
                                            <Flex justifyContent={"space-between"}>
                                                <Heading size="md" mb={3}>
                                                    Meeting View page
                                                </Heading>
                                                <Button leftIcon={<IoIosArrowBack />} size='sm' variant="brand" onClick={() => navigate(-1)}>
                                                    Back
                                                </Button>
                                            </Flex>
                                            <HSeparator />
                                        </Box>

                                    </GridItem>
                                    <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Agenda </Text>
                                            <Text>{data?.agenda ? data?.agenda : ' - '}</Text>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Created By </Text>
                                            <Text>{data?.createdByName ? data?.createdByName : ' - '}</Text>
                                        </GridItem>

                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> DateTime </Text>
                                            <Text> {data?.dateTime ? moment(data?.dateTime).format('DD-MM-YYYY  h:mma ') : ' - '} [{data?.dateTime ? moment(data?.dateTime).toNow() : ' - '}]</Text>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Timestamp </Text>
                                            <Text> {data?.timestamp ? moment(data?.timestamp).format('DD-MM-YYYY  h:mma ') : ' - '} [{data?.timestamp ? moment(data?.timestamp).toNow() : ' - '}]</Text>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Location </Text>
                                            <Text>{data?.location ? data?.location : ' - '}</Text>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>  Notes </Text>
                                            <Text>{data?.notes ? data?.notes : ' - '}</Text>
                                        </GridItem>
                                        <GridItem colSpan={{ base: 2, md: 1 }}>
                                            <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Attendes </Text>
                                            {data?.related === 'Contact' && contactAccess?.view ? data?.attendes && data?.attendes.map((item) => {
                                                return (
                                                    <Link to={`/contactView/${item._id}`}>
                                                        <Text color='brand.600' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{item.firstName + ' ' + item.lastName}</Text>
                                                    </Link>
                                                )
                                            }) : data?.related === 'Lead' && leadAccess?.view ? data?.attendesLead && data?.attendesLead.map((item) => {
                                                return (
                                                    <Link to={`/leadView/${item._id}`}>
                                                        <Text color='brand.600' sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{item.leadName}</Text>
                                                    </Link>
                                                )
                                            }) : data?.related === 'contact' ? data?.attendes && data?.attendes.map((item) => {
                                                return (
                                                    <Text color='blackAlpha.900' >{item.firstName + ' ' + item.lastName}</Text>
                                                )
                                            }) : data?.related === 'lead' ? data?.attendesLead && data?.attendesLead.map((item) => {
                                                return (
                                                    <Text color='blackAlpha.900' >{item.leadName}</Text>
                                                )
                                            }) : '-'}
                                        </GridItem>
                                    </Grid>
                                </Grid>
                            </Card>
                        </GridItem>

                    </Grid>
                    {(user.role === 'superAdmin' || (permission?.update || permission?.delete)) && <Card mt={3}>
                        <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                            <GridItem colStart={6} >
                                <Flex justifyContent={"right"}>
                                    {(user.role === 'superAdmin' || permission?.delete) ? <Button size='sm' style={{ background: 'red.800' }} onClick={() => setDeleteMany(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button> : ''}
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Card>
                    }

                </>}
            {/* Delete model */}
            <CommonDeleteModel isOpen={deleteMany} onClose={() => setDeleteMany(false)} type='Meetings' handleDeleteData={handleDeleteMeeting} ids={params.id} />
        </>
    );
};

export default View;
