import {
  Box,
  Checkbox,
  Flex,
  Table,
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
import { DeleteIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getApi } from "services/api";
import Delete from "../Delete";
// import '.\src\assets\css\App.css' 
export default function CheckTable(props) {
  const { columnsData } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isLoding, setIsLoding] = useState(false)
  const [deleteModel, setDelete] = useState(false);
  // const data = useMemo(() => tableData, [tableData]);
  const [data, setData] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))
  const [gopageValue, setGopageValue] = useState()

  const fetchData = async () => {
    setIsLoding(true)
    let result = await getApi(user.role === 'admin' ? 'api/property/' : `api/property/?createBy=${user._id}`);
    setData(result.data);
    setIsLoding(false)
  }

  const tableInstance = useTable(
    {
      columns, data,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableInstance;

  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length)
  }


  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };

  useEffect(() => {
    fetchData()
  }, [deleteModel, props.isOpen])

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="15px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Properties (<CountUpComponent targetNumber={data?.length} />)
        </Text>
        {/* <Menu /> */}
        {selectedValues.length > 0 && <DeleteIcon onClick={() => setDelete(true)} color={'red'} />}
      </Flex>
      {/* Delete model */}
      <Delete isOpen={deleteModel} onClose={setDelete} setSelectedValues={setSelectedValues} url='api/property/deleteMany' data={selectedValues} method='many' />

      <Box overflowY={"auto"} className="table-fix-container">
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
            {isLoding ?
              <Tr>
                <Td colSpan={columns?.length} >
                  <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                    <Spinner />
                  </Flex>
                </Td>
              </Tr>
              : data?.length === 0 ? (
                <Tr>
                  <Td colSpan={columns.length} className="tableData">
                    <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                      -- No Data Found --
                    </Text>
                  </Td>
                </Tr>
              ) : page?.map((row, i) => {
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
                      } else if (cell?.column.Header === "property Type") {
                        data = (
                          <Link to={user?.role !== 'admin' ? `/propertyView/${cell?.row?.values._id}` : `/admin/propertyView/${cell?.row?.values._id}`}>
                            <Text
                              className="tableData"
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
                      } else if (cell?.column.Header === "property Address") {
                        data = (
                          <Text
                            className="tableData"
                            me="10px"
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "listing Price") {
                        data = (
                          <Text
                            className="tableData"
                            me="10px"
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "square Footage") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="700" className="tableData">
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "year Built") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="700" className="tableData">
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "number of Bedrooms") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="700" className="tableData">
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "number of Bathrooms") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="700" className="tableData">
                            {cell?.value}
                          </Text>
                        );
                      }
                      return (
                        <Td
                          className="tableData"
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
      </Box>
      {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage} pageSize={pageSize} pageIndex={pageIndex} />}


    </Card>
  );
}
