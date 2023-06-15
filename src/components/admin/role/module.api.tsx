import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Collapse, Row, Tooltip } from 'antd';
import ProForm, { ModalForm, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import _, { result } from "lodash";
import { grey } from '@ant-design/colors';
import { CheckCircleOutlined, CloseCircleOutlined, ControlOutlined, MacCommandOutlined } from '@ant-design/icons';
import { colorMethod } from '@/config/utils';
import { IPermission } from '@/types/backend';
import { callFetchPermission } from '@/config/api';
import 'styles/reset.scss';
import type { ProFormInstance } from '@ant-design/pro-form';


const { Panel } = Collapse;

interface IProps {
  initData: IPermission[] | undefined;
  onChange?: (data: any[]) => void;
  onReset?: () => void;
  form: ProFormInstance;
  listPermissions: {
    module: string;
    permissions: IPermission[]
  }[] | null

};

const ModuleApi = (props: IProps) => {
  const { form, listPermissions } = props;

  useEffect(() => {
    if (listPermissions && listPermissions?.length) {
      listPermissions.forEach(item => {
        // form.setFieldValue("abc", item.)
      })
    }
  }, [listPermissions])

  const handleSwitchAll = (value: boolean, name: string) => {
    const child = listPermissions?.find(item => item.module === name);
    if (child) {
      child?.permissions?.forEach(item => {
        if (item._id)
          form.setFieldValue(item._id, value)
      })
    }
  }

  const handleSingleCheck = (value: boolean, child: string, parent: string) => {
    form.setFieldValue(child, value);

    //check all
    const temp = listPermissions?.find(item => item.module === parent);
    if (temp) {
      const restPermission = temp?.permissions?.filter(item => item._id !== child);
      if (restPermission && restPermission.length) {
        const allTrue = restPermission.every(item => form.getFieldValue((item._id) as string));
        form.setFieldValue(parent, allTrue && value)
      }
    }
  }


  return (
    <Card size="small" bordered={false}>
      <Collapse
      >
        {
          listPermissions?.map((item, index) => (
            <Panel
              header={<div>{item.module}</div>}
              key={index}
              collapsible='header'

              extra={
                <div className={'customize-form-item'}>
                  <ProFormSwitch
                    name={item.module}
                    fieldProps={{
                      defaultChecked: false,
                      onChange: (v) => handleSwitchAll(v, item.module)
                    }}

                  />
                </div>
              }
            >
              <Row gutter={[16, 16]}>
                {
                  item.permissions?.map((value, i: number) => (
                    <Col lg={12} md={12} sm={24} key={i}>
                      <Card size="small" bodyStyle={{ display: "flex", flex: 1, flexDirection: 'row' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <ProFormSwitch
                            name={value._id}
                            fieldProps={{
                              defaultChecked: false,
                              onChange: (v) => handleSingleCheck(v, (value._id) as string, item.module)
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <Tooltip title={value?.name}>
                            <p style={{ paddingLeft: 10, marginBottom: 3 }}>{value?.name || ''}</p>
                            <div style={{ display: 'flex' }}>
                              <p style={{ paddingLeft: 10, fontWeight: 'bold', marginBottom: 0, color: colorMethod(value?.method) }}>{value?.method || ''}</p>
                              <p style={{ paddingLeft: 10, marginBottom: 0, color: grey[5] }}>{value?.apiPath || ''}</p>
                            </div>
                          </Tooltip>
                        </div>
                      </Card>
                    </Col>
                  ))
                }
              </Row>
            </Panel>
          ))
        }
      </Collapse>
    </Card>
  );
};

export default ModuleApi;