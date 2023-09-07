import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    Box, Button, Flex, Grid, GridItem, Heading, Menu, MenuButton, MenuDivider, MenuItem, MenuList,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import FolderTreeView from 'components/FolderTreeView/folderTreeView';
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { constant } from "constant";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { BsFillSendFill, BsFillTelephoneFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { SiGooglemeet } from "react-icons/si";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import ColumnsTable from "../contact/components/ColumnsTable";
import PhoneCall from "../contact/components/phonCall";
import AddEmailHistory from "../emailHistory/components/AddEmail";
import AddMeeting from "../meeting/components/Addmeeting";
import MeetingTable from "../meeting/components/CheckTable";
import AddPhoneCall from "../phoneCall/components/AddPhoneCall";
import TaskTable from "../task/components/CheckTable.js";
import AddTask from "../task/components/addTask";
import Add from "./Add";
import Delete from "./Delete";
import Edit from "./Edit";


const View = () => {

    const param = useParams()

    const [data, setData] = useState()
    const [allData, setAllData] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [isLoding, setIsLoding] = useState(false)
    const [taskModel, setTaskModel] = useState(false);
    const [addMeeting, setMeeting] = useState(false);

    const size = "lg";


    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);

    const columnsDataColumns = [
        { Header: "sender", accessor: "senderName", },
        { Header: "recipient", accessor: "createByName", },
        { Header: "time stamp", accessor: "timestamp", },
        { Header: "Created", accessor: "createBy", },
    ];

    const textColumnsDataColumns = [
        { Header: "sender", accessor: "senderName", },
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
        let response = await getApi('api/lead/view/', param.id)
        setData(response.data?.lead);
        setAllData(response.data);
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
            <Delete isOpen={deleteModel} onClose={setDelete} method='one' url='api/lead/delete/' id={param.id} />

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
                                <Link to="/lead">
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
                        </TabList>

                        <TabPanels>
                            <TabPanel pt={4} p={0}>

                                <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Basic Lead Information
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Name</Text>
                                                    <Text>{data?.leadName ? data?.leadName : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Email</Text>
                                                    <Text>{data?.leadEmail ? data?.leadEmail : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Phone Number</Text>
                                                    <Text>{data?.leadPhoneNumber ? data?.leadPhoneNumber : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Address</Text>
                                                    <Text>{data?.leadAddress ? data?.leadAddress : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Lead Assignment and Ownership
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Assigned Agent</Text>
                                                    <Text>{data?.leadAssignedAgent ? data?.leadAssignedAgent : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Assigned Agent</Text>
                                                    <Text>{data?.leadAssignedAgent ? data?.leadAssignedAgent : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Communication Preferences</Text>
                                                    <Text>{data?.leadCommunicationPreferences ? data?.leadCommunicationPreferences : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Lead Source and Details
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source </Text>
                                                    <Text>{data?.leadSource ? data?.leadSource : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Status </Text>
                                                    <Text textTransform={'capitalize'}>{data?.leadStatus ? toCamelCase(data?.leadStatus) : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source Details </Text>
                                                    <Text>{data?.leadSourceDetails ? data?.leadSourceDetails : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Campaign </Text>
                                                    <Text>{data?.leadCampaign ? data?.leadCampaign : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source Channel </Text>
                                                    <Text>{data?.leadSourceChannel ? data?.leadSourceChannel : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source Medium </Text>
                                                    <Text>{data?.leadSourceMedium ? data?.leadSourceMedium : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source Campaign </Text>
                                                    <Text>{data?.leadSourceCampaign ? data?.leadSourceCampaign : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Source Referral </Text>
                                                    <Text>{data?.leadSourceReferral ? data?.leadSourceReferral : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Lead Dates and Follow-up
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead FollowUp Status </Text>
                                                    <Text>{data?.leadFollowUpStatus ? data?.leadFollowUpStatus : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Creation Date </Text>
                                                    <Text>{moment(data?.leadCreationDate).format('L')}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Conversion Date </Text>
                                                    <Text>{moment(data?.leadConversionDate).format('L')}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold">  Lead FollowUp Date </Text>
                                                    <Text>{moment(data?.leadFollowUpDate).format('L')}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>

                                    <GridItem colSpan={{ base: 12 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Lead Scoring and Nurturing
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Score </Text>
                                                    <Text>{data?.leadScore ? data?.leadScore : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Nurturing Workflow </Text>
                                                    <Text>{data?.leadNurturingWorkflow ? data?.leadNurturingWorkflow : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Engagement Level </Text>
                                                    <Text>{data?.leadEngagementLevel ? data?.leadEngagementLevel : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Conversion Rate </Text>
                                                    <Text>{data?.leadConversionRate ? data?.leadConversionRate : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Nurturing Stage </Text>
                                                    <Text>{data?.leadNurturingStage ? data?.leadNurturingStage : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lead Next Action </Text>
                                                    <Text>{data?.leadNextAction ? data?.leadNextAction : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                </Grid>

                            </TabPanel>
                            <TabPanel pt={4} p={0}>
                                <GridItem colSpan={{ base: 4 }} >
                                    <Card >
                                        <Grid overflow={'hidden'} templateColumns={{ base: "1fr" }} gap={4}>
                                            <GridItem colSpan={2}>
                                                <Box>
                                                    <Heading size="md" mb={3}>
                                                        Communication
                                                    </Heading>
                                                    <HSeparator />
                                                </Box>
                                            </GridItem>
                                            <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                <GridItem colSpan={{ base: 2 }}>
                                                    {allData?.Email && allData?.Email?.length ? <ColumnsTable fetchData={fetchData} columnsData={columnsDataColumns} lead='true' tableData={allData.Email} title={'Email '} /> : <Button onClick={() => setAddEmailHistory(true)} leftIcon={<BsFillSendFill />} colorScheme="gray" >Send Email </Button>}
                                                    <AddEmailHistory fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} data={data?.contact} lead='true' id={param.id} />
                                                </GridItem>
                                                <GridItem colSpan={{ base: 2 }}>
                                                    {allData?.phoneCall?.length > 0 ? <PhoneCall fetchData={fetchData} columnsData={columnsDataColumns} lead='true' tableData={allData?.phoneCall} title={'Call '} /> : <Button onClick={() => setAddPhoneCall(true)} leftIcon={<BsFillTelephoneFill />} colorScheme="gray" > Call </Button>}
                                                    <AddPhoneCall fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} data={data?.contact} id={param.id} lead='true' />
                                                </GridItem>
                                                <GridItem colSpan={{ base: 2 }}>
                                                    {allData?.task?.length > 0 ? <TaskTable className='table-container' setTaskModel={setTaskModel} fetchData={fetchData} columnsData={taskColumns} data={allData?.task} title={'Task '} /> : <Button onClick={() => setTaskModel(true)} leftIcon={<AddIcon />} colorScheme="gray" >Create Task</Button>}
                                                    <AddTask fetchData={fetchData} isOpen={taskModel} onClose={setTaskModel} from="lead" id={param.id} />
                                                </GridItem>
                                                <GridItem colSpan={{ base: 2 }}>
                                                    {allData?.meeting?.length > 0 ? <MeetingTable className='table-container' setMeeting={setMeeting} fetchData={fetchData} columnsData={MeetingColumns} data={allData?.meeting} title={'meeting '} /> : <Button onClick={() => setMeeting(true)} leftIcon={<SiGooglemeet />} colorScheme="gray" >Add Meeting </Button>}
                                                    <AddMeeting fetchData={fetchData} isOpen={addMeeting} onClose={setMeeting} from="lead" id={param.id} />
                                                </GridItem>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </GridItem>
                            </TabPanel>
                            <TabPanel pt={4} p={0}>
                                <GridItem colSpan={{ base: 4 }} >
                                    <Card minH={'50vh'} >
                                        <Heading size="lg" mb={4} >
                                            Documents
                                        </Heading>
                                        <HSeparator />
                                        <VStack mt={4} alignItems="flex-start">
                                            {allData?.Document?.length > 0 ? allData?.Document?.map((item) => (
                                                <FolderTreeView name={item.folderName} item={item}>
                                                    {item?.files?.map((file) => (
                                                        <FolderTreeView download={download} data={file} name={file.fileName} isFile from="lead" />
                                                    ))}
                                                </FolderTreeView>
                                            )) : <Text> No Documents Found</Text>}
                                        </VStack>
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
                </>
            }
        </>
    );
};

export default View;
