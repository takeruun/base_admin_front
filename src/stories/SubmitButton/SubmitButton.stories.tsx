import { ComponentStory, ComponentMeta } from '@storybook/react';
import SubmitButton, { SubmitButtonPropsType } from './index';

export default {
  title: 'SubmitButton',
  component: SubmitButton,
  argTypes: {}
} as ComponentMeta<typeof SubmitButton>;

const Template: ComponentStory<typeof SubmitButton> = (args) => (
  <SubmitButton {...args} />
);

export const Primary = Template.bind({});
const primaryArgs: SubmitButtonPropsType = {
  props: {
    variant: 'contained'
  },
  isSubmitting: false,
  text: 'Submit'
};
Primary.args = primaryArgs;
