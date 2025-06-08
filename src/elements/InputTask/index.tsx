import { Box, Stack, TextInput } from '@mantine/core';
import React from 'react';

const InputTask = () => {
  return (
    <Box
      pos='fixed'
      bg={'white'}
      h={'lg'}
      right={0}
      left={0}
      bottom={0}
      pb={64}
      px={{ base: 16, md: 32 }}
      pt={16}
    >
      <Stack>
        <TextInput placeholder='What do you need to do?' />
      </Stack>
    </Box>
  );
};

export default InputTask;
