import {
  Flex,
  Table,
  Checkbox,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { Link } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import Delete from "../Delete";
import AddEmailHistory from "views/admin/emailHistory/components/AddEmailHistory";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";
import CountUpComponent from "components/countUpComponent/countUpComponent";

export default function CheckTable(props) {
  const { columnsData, tableData, fetchData } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);

  const [deleteModel, setDelete] = useState(false);
  const [selectedId, setSelectedId] = useState()
  // const [data, setData] = useState([])
  const data = useMemo(() => tableData, [tableData]);

  // const fetchData = async () => {
  //   let result = await getApi('api/contact/');
  //   setData(result.data);
  // }
  const user = JSON.parse(localStorage.getItem("user"))


  const tableInstance = useTable(
    {
      columns, data,
      // initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    // setPageSize,
  } = tableInstance;

  initialState.pageSize = 10
  const { pageIndex } = state;



  // const handlePageSizeChange = (e) => {
  //   setPageSize(e.target.value);
  // };


  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };

  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);


  useEffect(() => {
    if (fetchData) fetchData()
  }, [deleteModel, props.isOpen])

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "scroll" }}
    >

      <AddEmailHistory fetchData={fetchData} isOpen={addEmailHistory} onClose={setAddEmailHistory} id={selectedId} />
      <AddPhoneCall fetchData={fetchData} isOpen={addPhoneCall} onClose={setAddPhoneCall} id={selectedId} />

      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Contact Information Table (<CountUpComponent targetNumber={data?.length} />)
        </Text>
        {/* <Menu /> */}
        {selectedValues.length > 0 && <DeleteIcon onClick={() => setDelete(true)} color={'red'} />}
      </Flex>
      {/* Delete model */}
      <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/contact/deleteMany' data={selectedValues} method='many' />

      <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
        <Thead>
          {headerGroups?.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers?.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.isSortable !== false && column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                  >
                    {column.render("Header")}
                    {column.isSortable !== false && (
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : <FaSort />}
                      </span>
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {data?.length === 0 && (
            <Tr>
              <Td colSpan={columns.length}>
                <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                  -- No Data Found --
                </Text>
              </Td>
            </Tr>
          )}
          {data?.length > 0 && page?.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row?.getRowProps()} key={i}>
                {row?.cells?.map((cell, index) => {
                  let data = "";
                  if (cell?.column.Header === "#") {
                    data = (
                      <Flex align="center">
                        <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" />
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell?.row?.index + 1}
                        </Text>
                      </Flex>
                    );
                  } else if (cell?.column.Header === "title") {
                    data = (
                      <Text
                        me="10px"
                        color={textColor}
                        fontSize="sm"
                        fontWeight="700"
                      >
                        {cell?.value}
                      </Text>
                    );
                  } else if (cell?.column.Header === "first Name") {
                    data = (
                      <Link to={user?.role !== 'admin' ? `/contactView/${cell?.row?.original._id}` : `/admin/contactView/${cell?.row?.original._id}`}>
                        <Text
                          me="10px"
                          sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                          color='green.400'
                          fontSize="sm"
                          fontWeight="700"
                        >
                          {cell?.value}
                        </Text>
                      </Link>
                    );
                  } else if (cell?.column.Header === "last Name") {
                    data = (
                      <Text
                        me="10px"
                        color={textColor}
                        fontSize="sm"
                        fontWeight="700"
                      >
                        {cell?.value}
                      </Text>
                    );
                  } else if (cell?.column.Header === "phone Number") {
                    data = (
                      <Text fontSize="sm" fontWeight="700"
                        onClick={() => {
                          setAddPhoneCall(true)
                          setSelectedId(cell?.row?.values._id)
                        }}
                        color='green.400' sx={{ cursor: 'pointer', '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>
                        {cell?.value}
                      </Text>
                    );
                  } else if (cell?.column.Header === "Email Address") {
                    data = (
                      <Text fontSize="sm" fontWeight="700"
                        onClick={() => {
                          setAddEmailHistory(true)
                          setSelectedId(cell?.row?.values._id)
                        }}
                        color='green.400' sx={{ cursor: 'pointer', '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>
                        {cell?.value}
                      </Text>
                    );
                  } else if (cell?.column.Header === "physical Address") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell?.value}
                      </Text>
                    );
                  } else if (cell?.column.Header === "mailing Address") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell?.value}
                      </Text>
                    );
                  } else if (cell?.column.Header === "Contact Method") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell?.value}
                      </Text>
                    );
                  }

                  return (
                    <Td
                      {...cell?.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor="transparent"
                    >
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: "1rem" }}>


        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          <GrFormPrevious />
        </button>
        <span style={{ margin: "0 0.5rem" }}>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          <GrFormNext />
        </button>
      </div>

    </Card >
  );
}