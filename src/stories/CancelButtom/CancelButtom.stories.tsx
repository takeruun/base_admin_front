import { ComponentStory, ComponentMeta } from '@storybook/react';
import CancelButton, { CancelButtonPropsType } from './index';

export default {
  title: 'CancelButton',
  component: CancelButton,
  argTypes: {}
} as ComponentMeta<typeof CancelButton>;

const Template: ComponentStory<typeof CancelButton> = (args) => (
  <CancelButton {...args} />
);

export const Primary = Template.bind({});
const primaryArgs: CancelButtonPropsType = {
  props: {
    color: 'secondary'
  },
  text: 'Cancel'
};
Primary.args = primaryArgs;
