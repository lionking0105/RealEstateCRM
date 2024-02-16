import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Menu, MenuButton, Select, Checkbox, GridItem, Text, MenuItem, Grid, MenuList, FormLabel, useColorModeValue } from '@chakra-ui/react';
import { ChevronDownIcon } from "@chakra-ui/icons";
import { IoIosArrowBack } from 'react-icons/io';
import Card from 'components/card/Card';
import { getApi, putApi } from 'services/api';
import Spinner from "components/spinner/Spinner";

const Index = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [allModulesData, setAllModulesData] = useState([]);
    const navigate = useNavigate();
    const [moduleName, setModuleName] = useState('');
    const [moduleId, setModuleId] = useState('');
    const [fields, setFields] = useState([]);
    const [initialFields, setInitialFields] = useState([]);
    const [action, setAction] = useState(false);
    const textColor = useColorModeValue("gray.500", "white");
    const [selectedFields, setSelectedFields] = useState({});

    const handleCheckboxChange = (event, fieldId) => {
        let updatedFields = [...fields];

        let index = fields.findIndex((field) => field._id === fieldId);

        updatedFields[index].isTableField = event.target.checked;
        setFields([...updatedFields]);

        const valueChanged = initialFields[index].isTableField !== event.target.checked;

        if (valueChanged) {
            setSelectedFields((prevSelectedFields) => ({
                ...prevSelectedFields,
                [fieldId]: event.target.checked,
            }));
        }
        else {
            setSelectedFields((prevSelectedFields) => {
                const { [fieldId]: omit, ...rest } = prevSelectedFields;
                return rest;
            });
        }
    };

    const handleUpdateTableFields = async () => {
        try {
            setIsLoading(true);

            const updates = Object.entries(selectedFields)?.map(([fieldId, isTableField]) => ({
                fieldId: fieldId,
                isTableField,
            }));

            await putApi('api/custom-field/change-table-fields/', {
                moduleId,
                updates,
            });

            setSelectedFields({});
            setAction((pre) => !pre);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);

        let responseAllData = await getApi(`api/custom-field`);
        setAllModulesData(responseAllData?.data);

        if (moduleName) {
            let response = await getApi(`api/custom-field/?moduleName=${moduleName}`);
            let fieldsData = response?.data[0]?.fields;
            setFields(fieldsData);
            setInitialFields(JSON.parse(JSON.stringify(fieldsData)));
        }

        setIsLoading(false);
    }

    useEffect(() => {
        if (fetchData) fetchData()
    }, [moduleName, action])

    return (
        <>
            <Card>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Box >
                        <Text color={"secondaryGray.900"}
                            fontSize="22px"
                            fontWeight="700"
                        >{moduleName ? `${moduleName} Fields` : 'Select Module'}</Text>
                    </Box>
                    <Box>
                        <Flex>
                            {!isLoading && (
                                <Menu>
                                    <MenuButton as={Button} size='sm' rightIcon={<ChevronDownIcon />} variant="outline">
                                        {moduleName ? moduleName : 'Select Module'}
                                    </MenuButton>
                                    <MenuList minWidth={"10rem"}>
                                        <MenuItem onClick={() => { setModuleName(''); setModuleId(''); }}>Select Module</MenuItem>
                                        {allModulesData?.map((item, id) => (
                                            <MenuItem key={id} onClick={() => { setModuleName(item.moduleName); setModuleId(item._id); }}>{item.moduleName}</MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            )}
                            <Button onClick={() => navigate('/admin-setting')} variant="brand" size="sm" leftIcon={<IoIosArrowBack />} ml={2}>Back</Button>
                        </Flex>
                    </Box>
                </Flex>

                {isLoading ?
                    <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                        <Spinner />
                    </Flex> :
                    <>
                        {
                            moduleName ?
                                <> <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={5}>
                                    {fields && fields?.map((item, i) => (
                                        <GridItem colSpan={{ base: 12, md: 6 }} key={item._id}>
                                            <Flex
                                                alignItems="center"
                                                justifyContent="space-between"
                                                className="CustomFieldName"
                                            >
                                                <Text display='flex' alignItems='center' size='sm' colorScheme='gray' ms='4px' mt={4} fontSize='md' fontWeight='500' mb='8px' >
                                                    <Checkbox colorScheme="brandScheme" value={item?.isTableField} isChecked={item?.isTableField} onChange={(event) => handleCheckboxChange(event, item?._id)} me="10px" />
                                                    {item?.label}
                                                </Text>
                                            </Flex>
                                        </GridItem>
                                    ))}
                                </Grid>
                                    <Flex Flex justifyContent={'end'} mt='5' >
                                        {Object.keys(selectedFields)?.length > 0 && <Button colorScheme="brand" mr={2} onClick={() => handleUpdateTableFields()} size='sm'>Update</Button>}
                                    </Flex></>
                                : <Text
                                    textAlign={"center"}
                                    width="100%"
                                    color={'gray.500'}
                                    fontSize="sm"
                                    my='7'
                                    fontWeight="700"
                                >-- Please Select Module --</Text>
                        }
                    </>
                }

            </Card>
        </>
    )
}

export default Index;