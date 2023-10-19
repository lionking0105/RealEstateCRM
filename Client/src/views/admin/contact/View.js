import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Grid, GridItem, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack, useDisclosure } from "@chakra-ui/react";
import FolderTreeView from 'components/FolderTreeView/folderTreeView';
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { constant } from "constant";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BiLink, BiLogoLinkedin } from "react-icons/bi";
import { BsFillSendFill, BsFillTelephoneFill, BsTwitter } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { LuBuilding2 } from "react-icons/lu";
import { SiGooglemeet } from "react-icons/si";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import AddEmailHistory from "../emailHistory/components/AddEmail";
import AddMeeting from "../meeting/components/Addmeeting";
import MeetingTable from "../meeting/components/CheckTable";
import AddPhoneCall from "../phoneCall/components/AddPhoneCall";
import TaskTable from "../task/components/CheckTable.js";
import AddTask from "../task/components/addTask";
import Add from "./Add";
import Delete from "./Delete";
import Edit from "./Edit";
import ColumnsTable from "./components/ColumnsTable";
import PhoneCall from "./components/phonCall";
import PropertyModel from "./components/propertyModel";
import PropertyTable from "./components/propertyTable";


const View = () => {

    const param = useParams()

    const [data, setData] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [propertyModel, setPropertyModel] = useState(false);
    const [isLoding, setIsLoding] = useState(false)

    const [taskModel, setTaskModel] = useState(false);
    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);
    const [addMeeting, setMeeting] = useState(false);

    const size = "lg";
    const navigate = useNavigate()

    const columnsDataColumns = [
        { Header: "sender", accessor: "senderName", },
        { Header: "recipient", accessor: "createByName", },
        { Header: "time stamp", accessor: "timestamp", },
        { Header: "Created", accessor: "createBy", },
    ];

    const PropertyColumn = [
        { Header: 'property Type', accessor: 'propertyType' },
        { Header: "property Address", accessor: "propertyAddress", },
        { Header: "listing Price", accessor: "listingPrice", },
        { Header: "square Footage", accessor: "squareFootage", },
        { Header: "year Built", accessor: "yearBuilt", },
    ];
    const textColumnsDataColumns = [
        { Header: "sender", accessor: "sender", },
        { Header: "recipient", accessor: "to", },
        { Header: "time stamp", accessor: "timestamp", },
        { Header: "Created", accessor: "createBy", },
    ];

    const MeetingColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'agenda', accessor: 'agenda' },
        { Header: "date Time", accessor: "dateTime", },
        { Header: "times tamp", accessor: "timestamp", },
        { Header: "create By", accessor: "createdByName", },
    ];
    const taskColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 5 },
        { Header: 'Title', accessor: 'title' },
        { Header: "Category", accessor: "category", },
        { Header: "Assignment To", accessor: "assignmentToName", },
        { Header: "Start Date", accessor: "start", },
        { Header: "End Date", accessor: "end", },
    ];

    const download = async (data) => {
        if (data) {
            let result = await getApi(`api/document/download/`, data)
            if (result && result.status === 200) {
                window.open(`${constant.baseUrl}api/document/download/${data}`)
                toast.success('file Download successful')
            } else if (result && result.response.status === 404) {
                toast.error('file Not Found')
            }
        }
    }

    const fetchData = async () => {
        setIsLoding(true)
        let response = await getApi('api/contact/view/', param.id)
        setData(response.data);
        setIsLoding(false)
    }
    useEffect(() => {
        fetchData()
    }, [edit, addEmailHistory, addPhoneCall])

    function toCamelCase(text) {
        return text?.replace(/([a-z])([A-Z])/g, '$1 $2');
    }


    return (
        <>
            <Add isOpen={isOpen} size={size} onClose={onClose} />
            <Edit isOpen={edit} size={size} onClose={setEdit} />
            <Delete isOpen={deleteModel} onClose={setDelete} method='one' url='api/contact/delete/' id={param.id} />

            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> : <>
                    <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                        <GridItem colStart={6} >
                            <Flex justifyContent={"right"}>
                                <Menu>
                                    <MenuButton variant="outline" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                        Actions
                                    </MenuButton>
                                    <MenuDivider />
                                    <MenuList>
                                        <MenuItem onClick={() => onOpen()} icon={<AddIcon />}>Add</MenuItem>
                                        <MenuItem onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>
                                        <MenuDivider />
                                        <MenuItem onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                    </MenuList>
                                </Menu>
                                <Link to="/contacts">
                                    <Button leftIcon={<IoIosArrowBack />} variant="brand">
                                        Back
                                    </Button>
                                </Link>
                            </Flex>
                        </GridItem>
                    </Grid>

                    <Tabs >
                        <TabList
                            sx={{ '& button:focus': { boxShadow: 'none', }, }}
                        >
                            <Tab>Information</Tab>
                            <Tab>Activity</Tab>
                            <Tab>Document</Tab>
                            <Tab>Social Media</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel pt={4} p={0}>

                                <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                    <GridItem rowSpan={2} colSpan={{ base: 12, md: 6, lg: 4 }}>
                                        <Card >
                                            <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                <GridItem colSpan={2}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Basic Contact Information
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">
                                                            First Name
                                                        </Text>
                                                        <Text>{data?.contact?.firstName ? data?.contact?.firstName : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">
                                                            Last Name
                                                        </Text>
                                                        <Text>{data?.contact?.lastName ? data?.contact?.lastName : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">
                                                            Title
                                                        </Text>
                                                        <Text>{data?.contact?.title ? data?.contact?.title : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">
                                                            Phone Number
                                                        </Text>
                                                        <Text onClick={() => setAddPhoneCall(true)} color='green.400' sx={{ cursor: 'pointer', '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.contact?.phoneNumber ? data?.contact?.phoneNumber : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">
                                                            Mobile Number
                                                        </Text>
                                                        <Text>{data?.contact?.mobileNumber ? data?.contact?.mobileNumber : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">
                                                            Email Address
                                                        </Text>
                                                        <Text onClick={() => setAddEmailHistory(true)} color='green.400' sx={{ cursor: 'pointer', '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>{data?.contact?.email ? data?.contact?.email : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">
                                                            Physical Address
                                                        </Text>
                                                        <Text>{data?.contact?.physicalAddress ? data?.contact?.physicalAddress : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">
                                                            Mailing Address
                                                        </Text>
                                                        <Text>{data?.contact?.mailingAddress ? data?.contact?.mailingAddress : data?.contact?.physicalAddress}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">
                                                            Preferred Contact Method
                                                        </Text>
                                                        <Text>{data?.contact?.preferredContactMethod ? data?.contact?.preferredContactMethod : 'N/A'}</Text>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                        <Card >
                                            <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                <GridItem colSpan={2}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Lead Source Information
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Lead Source </Text>
                                                        <Text textTransform={'capitalize'}>{data?.contact?.leadSource ? toCamelCase(data?.contact?.leadSource) : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Referral Source </Text>
                                                        <Text textTransform={'capitalize'}>{data?.contact?.referralSource ? toCamelCase(data?.contact?.referralSource) : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Campaing Source </Text>
                                                        <Text textTransform={'capitalize'}>{data?.contact?.campaignSource ? toCamelCase(data?.contact?.campaignSource) : 'N/A'}</Text>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}>
                                        <Card >
                                            <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                <GridItem colSpan={2}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Status and Classifications
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Lead Status </Text>
                                                        <Text textTransform={'capitalize'}>{data?.contact?.leadStatus ? toCamelCase(data?.contact?.leadStatus) : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Lead Rating </Text>
                                                        <Flex alignItems={'center'}>
                                                            <AiFillStar color="gold" />
                                                            <Text>{data?.contact?.leadRating ? data?.contact?.leadRating : '0'}</Text>
                                                        </Flex>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Lead Conversion Probability </Text>
                                                        <Text textTransform={'capitalize'}>{data?.contact?.leadConversionProbability ? toCamelCase(data?.contact?.leadConversionProbability) : 'N/A'}</Text>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }} >
                                        <Card >
                                            <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                <GridItem colSpan={2}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Tags or Categories
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Tags Or Labels For Categorizing Contacts </Text>
                                                        <Text>{data?.contact?.tagsOrLabelsForcategorizingcontacts ? data?.contact?.tagsOrLabelsForcategorizingcontacts : 'N/A'}</Text>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }} >
                                        <Card >
                                            <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                <GridItem colSpan={2}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Important Dates
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Birthday </Text>
                                                        <Text>{data?.contact?.birthday ? moment(data?.contact?.birthday).format('LL') : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Anniversary </Text>
                                                        <Text>{data?.contact?.anniversary ? moment(data?.contact?.anniversary).format('LL') : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Key Milestones </Text>
                                                        <Text>{data?.contact?.keyMilestones ? data?.contact?.keyMilestones : 'N/A'}</Text>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }}  >
                                        <Card >
                                            <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                <GridItem colSpan={2}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Additional Personal Information
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Date Of Birth </Text>
                                                        <Text>{data?.contact?.dob ? moment(data?.contact?.dob).format('LL') : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Gender </Text>
                                                        <Text>{data?.contact?.gender ? data?.contact?.gender : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Occupation </Text>
                                                        <Text>{data?.contact?.occupation ? data?.contact?.occupation : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Interests Or Hobbies </Text>
                                                        <Text>{data?.contact?.interestsOrHobbies ? data?.contact?.interestsOrHobbies : 'N/A'}</Text>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }} >
                                        <Card >
                                            <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                <GridItem colSpan={2}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Lead Assignment and Team Collaboration
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}>Agent Or TeamMember </Text>
                                                        <Text>{data?.contact?.agentOrTeamMember ? data?.contact?.agentOrTeamMember : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> InternalNotes Or Comments </Text>
                                                        <Text>{data?.contact?.internalNotesOrComments ? data?.contact?.internalNotesOrComments : 'N/A'}</Text>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6, lg: 4 }} >
                                        <Card >
                                            <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                <GridItem colSpan={2}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Preferred Communication Preferences
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Communication Frequency </Text>
                                                        <Text>{data?.contact?.communicationFrequency ? data?.contact?.communicationFrequency : 'N/A'}</Text>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 2, md: 1 }}>
                                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Preferences </Text>
                                                        <Text>{data?.contact?.preferences ? data?.contact?.preferences : 'N/A'}</Text>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12 }} >
                                        <Card >
                                            <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                <GridItem colSpan={2}>
                                                    <Box>
                                                        <Flex alignItems={'center'} mb={2} justifyContent={'space-between'}>
                                                            <Heading size="md">
                                                                Property of Interest
                                                            </Heading>
                                                            <Button onClick={() => setPropertyModel(true)} leftIcon={<LuBuilding2 />} colorScheme="gray" >Select Interested Property  </Button>
                                                            <PropertyModel fetchData={fetchData} isOpen={propertyModel} onClose={setPropertyModel} id={param.id} interestProperty={data?.contact?.interestProperty} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>

                                                    <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                        <GridItem colSpan={{ base: 2 }}>
                                                            {data?.interestProperty?.interestProperty?.length > 0 && <PropertyTable fetchData={fetchData} columnsData={PropertyColumn} tableData={data?.interestProperty?.interestProperty} title={'Interested Property'} />}
                                                        </GridItem>
                                                    </Grid>
                                                </GridItem>

                                            </Grid>
                                        </Card>
                                    </GridItem>
                                </Grid>

                            </TabPanel>
                            <TabPanel pt={4} p={0}>
                                <GridItem colSpan={{ base: 12 }} >
                                    <Card overflow={'scroll'}>
                                        <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                            <GridItem colSpan={2}>
                                                <Box>
                                                    <Heading size="md" mb={3}>
                                                        Communication
                                                    </Heading>
                                                    <HSeparator />
                                                </Box>
                                            </GridItem>
                                            <Grid templateColumns={'repeat(12, 1fr)'} gap={4}>
                                                <GridItem colSpan={{ base: 12 }}>
                                                    {data?.EmailHistory.length > 0 ? <ColumnsTable fetchData={fetchData} columnsData={columnsDataColumns} tableData={data?.EmailHistory} title={'Email '} /> : <Button onClick={() => setAddEmailHistory(true)} leftIcon={<BsFillSendFill />} colorScheme="gray" >Send Email </Button>}
                                                    <AddEmailHistory fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} data={data?.contact} id={param.id} />
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }}>
                                                    {data?.phoneCallHistory?.length > 0 ? <PhoneCall fetchData={fetchData} columnsData={columnsDataColumns} tableData={data?.phoneCallHistory} title={'Call '} /> : <Button onClick={() => setAddPhoneCall(true)} leftIcon={<BsFillTelephoneFill />} colorScheme="gray" > Call </Button>}
                                                    <AddPhoneCall fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} data={data?.contact} id={param.id} />
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }}>
                                                    {data?.meetingHistory.length > 0 ? <MeetingTable className='table-container' fetchData={fetchData} setMeeting={setMeeting} columnsData={MeetingColumns} data={data?.meetingHistory} title={'Meeting '} /> : <Button onClick={() => setMeeting(true)} leftIcon={<SiGooglemeet />} colorScheme="gray" >Add Meeting </Button>}
                                                    <AddMeeting fetchData={fetchData} isOpen={addMeeting} onClose={setMeeting} from="contact" id={param.id} />
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }}>
                                                    {data?.task.length > 0 ? <TaskTable fetchData={fetchData} className='table-container' setTaskModel={setTaskModel} columnsData={taskColumns} data={data?.task} title={'Task '} /> : <Button onClick={() => setTaskModel(true)} leftIcon={<AddIcon />} colorScheme="gray" >Create Task</Button>}
                                                    <AddTask fetchData={fetchData} isOpen={taskModel} onClose={setTaskModel} from="contact" id={param.id} />
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }}>
                                                    <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Notes and Comments </Text>
                                                    <Text>{data?.contact?.notesandComments ? data?.contact?.notesandComments : 'N/A'}</Text>
                                                </GridItem>
                                                {/* <GridItem colSpan={{ base: 2 }}>
                                                    {data?.textMsg?.length > 0 ? <PhoneCall text='true' fetchData={fetchData} columnsData={textColumnsDataColumns} tableData={data?.textMsg} title={'Text Msg '} /> : <Button onClick={() => navigate('/communication-integration')} leftIcon={<MdOutlineMessage />} colorScheme="gray" >send text Msg</Button>}
                                                </GridItem> */}
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </GridItem>

                            </TabPanel>
                            <TabPanel pt={4} p={0}>
                                <GridItem colSpan={{ base: 12 }} >
                                    <Card minH={'40vh'} >
                                        <Heading size="lg" mb={4} >
                                            Documents
                                        </Heading>
                                        <HSeparator />
                                        <VStack mt={4} alignItems="flex-start">
                                            {data?.Document?.length > 0 ? data?.Document?.map((item) => (
                                                <FolderTreeView name={item.folderName} item={item}>
                                                    {item?.files?.map((file) => (
                                                        <FolderTreeView download={download} data={file} name={file.fileName} isFile from="contact" />
                                                    ))}
                                                </FolderTreeView>
                                            )) : <Text> No Documents Found</Text>}
                                        </VStack>
                                    </Card>
                                </GridItem>
                            </TabPanel>

                            <TabPanel pt={4} p={0}>

                                <GridItem colSpan={{ base: 12 }} >
                                    <Card >
                                        <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                            <GridItem colSpan={2} textAlign={'center'}>
                                                <Box>
                                                    <Heading size="md" mb={3}>
                                                        Social Media Profiles
                                                    </Heading>
                                                    <HSeparator />
                                                </Box>
                                            </GridItem>
                                            {data?.contact?.linkedInProfile || data?.contact?.facebookProfile || data?.contact?.twitterHandle || data?.contact?.otherProfiles ?
                                                <Grid templateColumns={'repeat(4, 1fr)'} gap={4} my={3} flexWrap={'wrap'} display={'flex'} justifyContent={'center'}>
                                                    {data?.contact?.linkedInProfile && <GridItem textAlign={'center'} colSpan={{ base: 2, md: 1 }}>
                                                        <a target='_blank' href={data?.contact?.linkedInProfile}>
                                                            <IconButton colorScheme="brand" aria-label="Call Fred" borderRadius="10px" size="md" icon={<BiLogoLinkedin />} />
                                                        </a>
                                                        <Text fontSize="sm" mt={2} fontWeight="bold" color={'blackAlpha.900'}> LinkedIn Profile  </Text>
                                                    </GridItem>}
                                                    {data?.contact?.facebookProfile && <GridItem textAlign={'center'} colSpan={{ base: 2, md: 1 }}>
                                                        <a target='_blank' href={`https://www.facebook.com/${data?.contact?.facebookProfile}`}>
                                                            <IconButton colorScheme="brand" aria-label="Call Fred" borderRadius="10px" size="md" icon={<FaFacebook />} />
                                                        </a>
                                                        <Text fontSize="sm" mt={2} fontWeight="bold" color={'blackAlpha.900'}> Facebook Profile  </Text>
                                                    </GridItem>}
                                                    {data?.contact?.linkedInProfile && <GridItem textAlign={'center'} colSpan={{ base: 2, md: 1 }}>
                                                        <a target='_blank' href={'https://twitter.com/' + data?.contact?.twitterHandle}>
                                                            <IconButton colorScheme="brand" aria-label="Call Fred" borderRadius="10px" size="md" icon={<BsTwitter />} />
                                                        </a>
                                                        <Text fontSize="sm" mt={2} fontWeight="bold" color={'blackAlpha.900'}> Twitter Handle  </Text>
                                                    </GridItem>}
                                                    {data?.contact?.linkedInProfile && <GridItem textAlign={'center'} colSpan={{ base: 2, md: 1 }}>
                                                        <a target='_blank' href={data?.contact?.otherProfiles}>
                                                            <IconButton colorScheme="brand" aria-label="Call Fred" borderRadius="10px" size="md" icon={<BiLink />} />
                                                        </a>
                                                        <Text fontSize="sm" mt={2} fontWeight="bold" color={'blackAlpha.900'}> Other Profiles  </Text>
                                                    </GridItem>}
                                                </Grid>
                                                :
                                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                    <GridItem colSpan={{ base: 2 }} textAlign={'center'}>
                                                        <Heading size="md" >No Profile Found</Heading>
                                                    </GridItem>
                                                </Grid>
                                            }
                                        </Grid>
                                    </Card>
                                </GridItem>

                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                    <Card mt={3}>
                        <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                            <GridItem colStart={6} >
                                <Flex justifyContent={"right"}>
                                    <Button onClick={() => setEdit(true)} leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>
                                    <Button style={{ background: 'red.800' }} onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Card>
                </>}
        </>
    );
};

export default View;
