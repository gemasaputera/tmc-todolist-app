import { Flex, Text } from '@mantine/core';
import Image from 'next/image';
import React from 'react';

interface IllustrationStateProps {
  illustration?: React.ReactNode;
  description?: string;
}

const IllustrationState: React.FC<IllustrationStateProps> = ({
  illustration,
  description = `You Don't Have a Todo Yet`
}) => {
  return (
    <Flex flex={1} direction={'column'} justify={'center'} align={'center'}>
      {illustration || (
        <Image
          src={'/illustration_empty-document.svg'}
          width={273}
          height={273}
          alt="Illustration state"
        />
      )}
      {description && (
        <Text
          fz={16}
          mt={10}
          style={{
            color: '#154886',
            opacity: 0.3
          }}
        >
          {description}
        </Text>
      )}
    </Flex>
  );
};

export default IllustrationState;
