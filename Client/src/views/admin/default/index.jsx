// Chakra imports
import {
  Flex,
  Heading,
  Icon,
  IconButton,
  SimpleGrid,
  useColorModeValue,
  Grid,
  GridItem,
} from "@chakra-ui/react";
// Assets
// Custom components
import { ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { HSeparator } from "components/separator/Separator";
import { useEffect, useState } from "react";
import { LuBuilding2 } from "react-icons/lu";
import { MdAddTask, MdContacts, MdLeaderboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import ReportChart from "../reports/components/reportChart";
import Chart from "../reports/components/chart";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const user = JSON.parse(localStorage.getItem("user"));

  const [task, setTask] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    let taskData = await getApi(
      user.role === "admin" ? "api/task/" : `api/task/?createBy=${user._id}`
    );
    let contact = await getApi(
      user.role === "admin"
        ? "api/contact/"
        : `api/contact/?createBy=${user._id}`
    );
    let lead = await getApi(
      user.role === "admin" ? "api/lead/" : `api/lead/?createBy=${user._id}`
    );
    let property = await getApi(
      user.role === "admin"
        ? "api/property/"
        : `api/property/?createBy=${user._id}`
    );

    setPropertyData(property?.data);
    setLeadData(lead?.data);
    setContactData(contact?.data);
    setTask(taskData?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb="20px">
        {/* , "2xl": 6 */}
        <MiniStatistics
          onClick={() => navigate("/task")}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
            />
          }
          name="Tasks"
          value={task?.length || 0}
        />
        <MiniStatistics
          onClick={() => navigate("/contacts")}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdContacts} color={brandColor} />
              }
            />
          }
          name="Contacts"
          value={contactData?.length || 0}
        />
        <MiniStatistics
          onClick={() => navigate("/lead")}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdLeaderboard} color={brandColor} />
              }
            />
          }
          name="Leads"
          value={leadData?.length || 0}
        />
        <MiniStatistics
          onClick={() => navigate("/properties")}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={LuBuilding2} color={brandColor} />
              }
            />
          }
          name="property"
          value={propertyData?.length || 0}
        />
      </SimpleGrid>

      <Grid templateColumns="repeat(12, 1fr)" gap={3}>
        <GridItem rowSpan={2} colSpan={{ base: 12, md: 8 }}>
          <Card>
            <Flex mb={3} alignItems={"center"} justifyContent={"space-between"}>
              <Heading size="md">Report</Heading>
              <IconButton
                color={"green.500"}
                onClick={() => navigate("/reporting-analytics")}
                aria-label="Call Fred"
                borderRadius="10px"
                size="md"
                icon={<ViewIcon />}
              />
            </Flex>
            <HSeparator />
            <ReportChart dashboard={"dashboard"} />
          </Card>
        </GridItem>
        <GridItem rowSpan={2} colSpan={{ base: 12, md: 4 }}>
          <Card>
            <Flex mb={3} alignItems={"center"} justifyContent={"space-between"}>
              <Heading size="md">Report</Heading>
              <IconButton
                color={"green.500"}
                onClick={() => navigate("/reporting-analytics")}
                aria-label="Call Fred"
                borderRadius="10px"
                size="md"
                icon={<ViewIcon />}
              />
            </Flex>
            <HSeparator />
            <Chart dashboard={"dashboard"} />
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}
