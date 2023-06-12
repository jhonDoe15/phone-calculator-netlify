import React, { useState } from "react";
import { Button, Form, Grid, Modal } from "semantic-ui-react";
import {} from "semantic-ui-react";

import axios from "axios";

const AddPhoneModal = (props) => {
  const formDataInitialState = {
    device_name: "",
    battery_life: 0,
    price: 0,
    year: 0,
    image_url: "",
    screen_size: 0,
    phone_url: "",
    has_nfc: false,
    has_headphone_jack: false,
    has_dual_sim: false,
    has_ir: false,
    antutu_score: 0,
  };

  const requestHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(formDataInitialState);
  const [loading, setLoading] = useState(false);

  const sendNewPhone = async () => {
    setLoading(true);
    await axios.post(`http://localhost:5000/phone`, formData, requestHeaders)
    .catch(() => {
        setLoading(false);
    });
    // await new Promise((r) => setTimeout(r, 2500));
    setLoading(false);
    setOpen(false);
  };

  const handleChange = (e) => {

    setFormData((formData) => {
      return {
        ...formData,
        [e.target.name]: e.target.type == "number" ? e.target.valueAsNumber : e.target.value,
      };
    });
  };

  const handleCheckBoxChange = (e, data) => {
    setFormData((formData) => {
      return {
        ...formData,
        [data.name]: data.checked,
      };
    });
  };

  return (
    <Grid>
      <Grid.Column width={4}>
        <Modal
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          open={open}
          trigger={props.children}
        >
          <Modal.Header>Add Your New Device</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  onChange={handleChange}
                  name="device_name"
                  value={formData.device_name}
                  type="text"
                  fluid
                  label="Device Name"
                  placeholder="Device Name"
                />
                <Form.Input
                  onChange={handleChange}
                  name="battery_life"
                  value={formData.battery_life}
                  type="number"
                  step={1}
                  min={0}
                  fluid
                  label="Battery Life (Test Houres)"
                  placeholder="Battery Life"
                />
                <Form.Input
                  onChange={handleChange}
                  name="price"
                  value={formData.price}
                  type="number"
                  step={1}
                  min={0}
                  fluid
                  label="Price"
                  placeholder="Price"
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  onChange={handleChange}
                  name="year"
                  value={formData.year}
                  type="number"
                  fluid
                  label="Release Year"
                  placeholder="Release Year"
                />
                <Form.Input
                  onChange={handleChange}
                  name="image_url"
                  value={formData.image_url}
                  type="text"
                  fluid
                  label="Image Url"
                  placeholder="Image Url"
                />
                <Form.Input
                  onChange={handleChange}
                  name="screen_size"
                  value={formData.screen_size}
                  type="number"
                  step={0.01}
                  min={0}
                  fluid
                  label="Screen Size"
                  placeholder="Screen Size"
                />
                <Form.Input
                  onChange={handleChange}
                  name="phone_url"
                  value={formData.phone_url}
                  type="text"
                  fluid
                  label="Phone Url"
                  placeholder="Phone Url"
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Checkbox
                  onChange={handleCheckBoxChange}
                  name="has_nfc"
                  value={formData.has_nfc}
                  fluid
                  label="NFC"
                  placeholder="NFC"
                />
                <Form.Checkbox
                  onChange={handleCheckBoxChange}
                  name="has_headphone_jack"
                  value={formData.has_headphone_jack}
                  fluid
                  label="3.5mm Jack"
                  placeholder="3.5mm Jack"
                />
                <Form.Checkbox
                  onChange={handleCheckBoxChange}
                  name="has_dual_sim"
                  value={formData.has_dual_sim}
                  fluid
                  label="Dual Sim"
                  placeholder="Dual Sim"
                />
                <Form.Checkbox
                  onChange={handleCheckBoxChange}
                  name="has_ir"
                  value={formData.has_ir}
                  fluid
                  label="Infra Red"
                  placeholder="Infra Red"
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  onChange={handleChange}
                  name="antutu_score"
                  value={formData.antutu_score}
                  type="number"
                  step={1}
                  min={0}
                  width={4}
                  fluid
                  label="Antutu Score"
                  placeholder="Antutu Score"
                />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setOpen(false)} negative disabled={loading}>
              Cancel
            </Button>
            <Button
              disabled={loading}
              loading={loading}
              onClick={sendNewPhone}
              type="submit"
              positive
            >
              Gimmie that phone 🤤
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default AddPhoneModal;
