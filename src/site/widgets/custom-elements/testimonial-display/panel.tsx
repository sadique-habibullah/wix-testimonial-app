import React, { type FC, useState, useEffect, useCallback } from "react";
import { widget, inputs } from "@wix/editor";

import {
  SidePanel,
  WixDesignSystemProvider,
  Input,
  FormField,
  SectionHelper,
  Box,
  TextButton,
  FillPreview,
} from "@wix/design-system";
import "@wix/design-system/styles.global.css";
import { DEFAULT_LEGEND_STYLE } from "./../testimonial-app/common";

const SITE_WIDGETS_DOCS =
  "https://dev.wix.com/docs/build-apps/develop-your-app/frameworks/wix-cli/supported-extensions/site-extensions/site-widgets/site-widget-extension-files-and-code";

const Panel: FC = () => {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    widget
      .getProp("display-name")
      .then((displayName) =>
        setDisplayName(displayName || `Your Widget's Title`)
      )
      .catch((error) => console.error("Failed to fetch display-name:", error));
  }, [setDisplayName]);

  const handleDisplayNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDisplayName = event.target.value;
      setDisplayName(newDisplayName);
      widget.setProp("display-name", newDisplayName);
    },
    [setDisplayName]
  );

  return (
    <WixDesignSystemProvider>
      <SidePanel width="300" height="100vh">
        <SidePanel.Content noPadding stretchVertically>
          <SidePanel.Field>
            <FormField label="Display Name">
              <Input
                type="text"
                value={displayName}
                onChange={handleDisplayNameChange}
                aria-label="Display Name"
              />
            </FormField>

            {/* select font  */}
            <FormField
              label="Select Font"
              labelPlacement="left"
              labelWidth="1fr"
            >
              <Box>
                <TextButton
                  size="small"
                  onClick={() => {
                    void inputs.selectFont(DEFAULT_LEGEND_STYLE, {
                      onChange: (value) => {
                        console.log("value: ", value);
                        // if (value) {
                        //   setLegendStyle(value);
                        //   void widget.setProp(
                        //     "legend-style",
                        //     JSON.stringify(value)
                        //   );
                        // }
                      },
                    });
                  }}
                >
                  Select
                </TextButton>
              </Box>
            </FormField>

            {/* select color */}
            <FormField
              label="Select color"
              labelPlacement="left"
              labelWidth="1fr"
            >
              <Box width="30px" height="30px">
                <FillPreview
                  fill={"#FF0000"}
                  onClick={() =>
                    inputs.selectColor("#FF0000", {
                      onChange: (value) => {
                        if (value) {
                          console.log("value: ", value);
                        }
                      },
                    })
                  }
                />
              </Box>
            </FormField>
          </SidePanel.Field>
        </SidePanel.Content>
        <SidePanel.Footer noPadding>
          <SectionHelper fullWidth appearance="success" border="topBottom">
            Learn more about{" "}
            <a
              href={SITE_WIDGETS_DOCS}
              target="_blank"
              rel="noopener noreferrer"
              title="Site Widget docs"
            >
              Site Widgets
            </a>
          </SectionHelper>
        </SidePanel.Footer>
      </SidePanel>
    </WixDesignSystemProvider>
  );
};

export default Panel;
