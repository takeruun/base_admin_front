import { ComponentStory, ComponentMeta } from '@storybook/react';
import FormLabel, { FormLabelPropsType } from './index';

export default {
  title: 'FormLabel',
  component: FormLabel,
  argTypes: {}
} as ComponentMeta<typeof FormLabel>;

const Template: ComponentStory<typeof FormLabel> = (args) => (
  <FormLabel {...args} />
);

export const Primary = Template.bind({});
const primaryArgs: FormLabelPropsType = {
  label: 'label'
};
Primary.args = primaryArgs;
