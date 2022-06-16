import { ComponentStory, ComponentMeta } from '@storybook/react';
import TextField from './index';
import { TextFieldPropsType } from './index';

export default {
  title: 'TextField',
  component: TextField,
  argTypes: {}
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => (
  <TextField {...args} />
);

export const Primary = Template.bind({});
const primaryArgs: TextFieldPropsType = {
  props: {
    placeholder: 'smaple',
    fullWidth: true,
    variant: 'outlined'
  }
};
Primary.args = primaryArgs;
