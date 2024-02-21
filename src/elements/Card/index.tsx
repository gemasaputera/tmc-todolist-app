import { Card as CardMantine, Stack, Text } from '@mantine/core';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <CardMantine withBorder py={24} px={32} radius={'lg'}>
      <Stack gap={0}>
        {title && (
          <Text fz={18} c={'#4F4F4F'} fw={500} mb={24}>
            {title}
          </Text>
        )}
        {children}
      </Stack>
    </CardMantine>
  );
};

export default Card;
