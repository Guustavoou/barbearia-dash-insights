import React from "react";

interface UnclicLogoProps {
  collapsed?: boolean;
  className?: string;
}

export const UnclicLogo: React.FC<UnclicLogoProps> = ({
  collapsed = false,
  className = "",
}) => {
  if (collapsed) {
    // Logo compacta (apenas o papagaio)
    return (
      <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
        <div
          className="w-8 h-8 rounded-lg"
          style={{
            backgroundImage:
              "url(https://cdn.builder.io/api/v1/image/assets%2F0f2ed365435c4939b5df2c6425b55f95%2F001ac0a4cc4940808963e01566fec743)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      </div>
    );
  }

  // Logo completa com imagem de fundo
  return (
    <div className={`flex flex-col py-2.5 ${className}`}>
      <div
        className="flex flex-col justify-center items-center rounded-lg overflow-hidden mx-auto"
        style={{
          width: "147px",
          height: "60px",
          backgroundImage:
            "url(https://cdn.builder.io/api/v1/image/assets%2F0f2ed365435c4939b5df2c6425b55f95%2F001ac0a4cc4940808963e01566fec743)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderRadius: "10px",
          boxShadow: "1px 1px 3px 0 rgba(0, 0, 0, 0.38)",
          backgroundColor: "#010c2a",
          color: "rgba(9, 24, 61, 1)",
          padding: "10px 0 10px 38px",
        }}
      >
        {/* Conteúdo da logo já está na imagem de fundo */}
      </div>
    </div>
  );
};

export default UnclicLogo;
